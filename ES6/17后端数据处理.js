// 从某数据库接口得到如下值：

const data = {
  rows: [
    ["Lisa", 16, "Female", "2000-12-01"],
    ["Bob", 22, "Male", "1996-01-21"]
  ],
  metaData: [{
      name: "name",
      note: ''
    },
    {
      name: "age",
      note: ''
    },
    {
      name: "gender",
      note: ''
    },
    {
      name: "birthday",
      note: ''
    }
  ]
};
// rows 是数据，metaData 是对数据的说明。现写一个函数 parseData，将上面的对象转化为期望的数组：

// [
//   { name: "Lisa", age: 16, gender: "Female", birthday: "2000-12-01" },
//   { name: "Bob", age: 22, gender: "Male", birthday: "1996-01-21" },
// ]

const parseData = (data) => {
  let arr = []
  data.rows.map((row, index) => {
    let obj = {}
    row.map((item, i) => {
      obj[data.metaData[i].name] = item
    })
    arr.push(obj)
  })
  return arr
}

console.log(parseData(data));