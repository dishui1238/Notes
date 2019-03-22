let promise = new Promise(function (resolve, reject) {
  // setTimeout(resolve('success'), 1000)
  setTimeout(reject(new Error('test')), 1000)
})

promise
  .then(function (item) {
    console.log(item);
    console.log('then');
  })
  .catch(function (err) {
    console.log(err);
  })