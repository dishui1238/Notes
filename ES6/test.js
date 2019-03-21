var loggedObj = new Proxy(obj, {
    get(target, name) {
      console.log('get', target, name);
      return Reflect.get(target, name);
    },
    deleteProperty(target, name) {
      console.log('delete' + name);
      return Reflect.deleteProperty(target, name);
    },
    has(target, name) {
      console.log('has' + name);
      return Reflect.has(target, name);
    }
  });

  