import { ScopedLocalStorage } from "./ScopedLocalStorage";

describe("ScopedLocalStorage", () => {
  describe("public methods", () => {
    afterEach(() => localStorage.clear());

    const scopedLocalStorage = new ScopedLocalStorage("-testing");
    test("@setItem", () => {
      scopedLocalStorage.setItem("foo", "bar");

      expect(localStorage.getItem("-testing:foo")).toEqual("bar");
      expect(localStorage.length).toEqual(1);
    });

    test("@getItem", () => {
      scopedLocalStorage.setItem("foo", "bar");
      const getVal = scopedLocalStorage.getItem("foo");

      expect(getVal).toEqual("bar");
    });

    test("@removeItem", () => {
      scopedLocalStorage.removeItem("foo");

      expect(localStorage.length).toEqual(0);
    });

    test("@getAllItems", () => {
      localStorage.setItem("other", "1");
      scopedLocalStorage.setItem("foo1", "bar1");
      scopedLocalStorage.setItem("foo2", "bar2");
      scopedLocalStorage.setItem("foo3", "bar3");
      expect(localStorage.length).toEqual(4);

      expect(scopedLocalStorage.getAllItems()).toEqual([
        "bar1",
        "bar2",
        "bar3",
      ]);
    });

    test("@clear", () => {
      localStorage.setItem("other", "1");
      scopedLocalStorage.setItem("foo1", "bar1");
      scopedLocalStorage.setItem("foo2", "bar2");
      scopedLocalStorage.setItem("foo3", "bar3");
      expect(localStorage.length).toEqual(4);

      scopedLocalStorage.clear();
      expect(localStorage.length).toEqual(1);
    });
  });
});
