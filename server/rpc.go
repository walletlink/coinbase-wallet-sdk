// Copyright (c) 2018-2020 WalletLink.org <https://www.walletlink.org/>
// Copyright (c) 2018-2020 Coinbase, Inc. <https://www.coinbase.com/>
// Licensed under the Apache License, version 2.0

package server

import (
	"log"
	"net"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/pkg/errors"
	"github.com/walletlink/walletlink/server/rpc"
)

const (
	websocketReadLimit = 1024 * 1024
	handshaketimeout   = time.Second * 30
)

func (srv *Server) rpcHandler(w http.ResponseWriter, r *http.Request) {
	upgrader := &websocket.Upgrader{HandshakeTimeout: handshaketimeout}

	upgrader.CheckOrigin = func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		if len(origin) == 0 || len(srv.allowedOrigins) == 0 || srv.allowedOrigins.Contains("*") {
			return true
		}
		return srv.allowedOrigins.Contains(origin)
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(errors.Wrap(err, "websocket upgrade failed"))
		return
	}

	log.Printf("Opened ws with IP: %s, %s User-Agent: %s", clientIP(r), r.RemoteAddr, r.Header.Get("User-Agent"))
	defer func() {
		log.Printf("Closed ws with IP: %s, %s User-Agent: %s", clientIP(r), r.RemoteAddr, r.Header.Get("User-Agent"))
		ws.Close()
	}()

	ws.SetReadLimit(websocketReadLimit)

	sendCh := make(chan interface{})
	defer close(sendCh)

	go func() {
		for {
			res, ok := <-sendCh
			if !ok {
				return
			}
			if v, ok := res.(rune); ok && v == 'h' {
				ws.WriteMessage(websocket.TextMessage, []byte("h"))
				continue
			}
			if err := ws.WriteJSON(res); err != nil {
				log.Println(errors.Wrap(err, "websocket write failed"))
				ws.Close()
				return
			}
		}
	}()

	handler, err := rpc.NewMessageHandler(
		sendCh,
		srv.store,
		srv.pubSub,
		srv.webhook,
	)
	if err != nil {
		log.Println(errors.Wrap(err, "message handler creation failed"))
		return
	}

	defer handler.Close()

	for {
		if srv.readDeadline > 0 {
			if err := ws.SetReadDeadline(time.Now().Add(srv.readDeadline)); err != nil {
				log.Println(errors.Wrap(err, "websocket set read deadline failed"))
				break
			}
		}

		msgType, msgData, err := ws.ReadMessage()
		if err != nil {
			if !websocket.IsCloseError(err) &&
				!websocket.IsUnexpectedCloseError(err) {
				log.Println(errors.Wrap(err, "websocket read failed"))
			}
			break
		}

		if msgType != websocket.TextMessage && msgType != websocket.BinaryMessage {
			continue
		}

		if err := handler.HandleRawMessage(msgData); err != nil {
			log.Println(err)
			break
		}
	}
}

func clientIP(req *http.Request) string {
	clientIP := req.Header.Get("X-Forwarded-For")
	clientIP = strings.TrimSpace(strings.Split(clientIP, ",")[0])
	if clientIP != "" {
		return clientIP
	}

	clientIP = strings.TrimSpace(req.Header.Get("X-Real-Ip"))
	if clientIP != "" {
		return clientIP
	}

	if ip, _, err := net.SplitHostPort(strings.TrimSpace(req.RemoteAddr)); err == nil {
		return ip
	}

	return ""
}
