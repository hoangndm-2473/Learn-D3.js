<div align="center">
<h1>Learn-D3.js</h1>
</div>

### Monthly Report Tháng 9 _ Nguyễn Đức Minh Hoàng
### Mini Project IMG: 
 ![Screen Shot 2021-09-19 at 23 45 59](https://user-images.githubusercontent.com/60843577/133935830-bff2d787-daf2-4eef-aaab-94ebfa945d9f.png)

###  Trong bài viết này chúng ta sẽ cùng đi tìm hiểu một số khái niệm cơ bản trong d3.js
---

## Grabbing data
- **D3-fetch** https://github.com/d3/d3-fetch
  - D3-fetch cung cấp một số phương thức để có thể lấy data từ file và phân tích nó thành javascrip object.
  - D3-fetch có thên phân tích các file với một vài formats khác nhau như: JSON, CSV, DSV, TSV.
  - In D3-fetch, Các phương thức thường là tên của file format, và chúng cần một tham số truyền vào là URL.

Ex:

```
const url = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/862592/"
d3.json(url)
  .then(res => {
    alert(`Current temperature: ${
      res.consolidated_weather[0].the_temp
    }°C`)
  })
  .catch(() => {
      alert("Oh no, something horrible happened!")
  })
```

## Manipulating data
- D3 cung cấp một số các phương thức để thao tác với dữ liệu như d3.max(), d3.min(), d3.extent(). Những phương thức này rất có ích khi tạo scale.

Để sử dụng những phương thức này chúng ta cần gọi nó với hai tham số:

  1. __our dataset__ :Tham số thứ nhất cần phải là một array chứa giá trị mà chúng ta quan tâm đến. Nếu tham giá trị mà chúng ta quan tâm đến không nằm trực tiếp trong array này mà nằm ở những object con của array thì chúng ta cần dùng tham số thứ hai.
  2. __an accessor function (optional)__: Tham số accessor function này cho d3 biết những object con nào được chọn để so sánh.

Xem ví dụ dưới để hiểu rõ hơn:
```
const dataset = [{
    date: "2019-10-10",
    temp: 10,
},{
    date: "2019-10-11",
    temp: 12,
}]

// Ở đây ta muốn tìm nhiệt độ lớn nhất thì sẽ làm như sau:
const tempMax = d3.max(dataset, d => d.temp)
// tempMax = 12
```

Ngoài ra ra d3 còn cung cấp các phương thức

- __d3.least()__ :  Để tìm item có giá trị nhỏ nhất.
- __d3.leastIndex()__:  sẽ trả về item's index có giá trị nhỏ nhất.
- __d3.bisect()__ : sẽ trả về item's index có giá trị gần đúng nhât. Những function này rất hữu dụng khi tạo các tooltips. Tìm điểm gần nhất với con trỏ của người dùng là các tốt để cho người dùng có thể tương tác được với chart.

## d3-random
Trình duyệt của chúng ta sử dụng Math.random() function, Math.random() có ích trong những trường hợp đơn giãn nhưng nó không thể random ra data có cấu trúc được.

d3-random cho bạn có thể tạo ra numbers với sự phân phối cụ thể. Ví dụ bạn muốn random ra number quanh một con số cụ thể. Bạn có thể sử dụng d3.randomNormal().

## Manipulating the DOM https://github.com/d3/d3-selection
Tưởng tượng rằng bạn muốn thêm vào DOM 1 element cho mỗi item trong dataset.
Trường hợp này bạn có thể sử dụng for loop một cách để dàng.
Nhưng rồi bạn bạn muốn khi dữ liệu thây đổi thi các phần tử trong DOM được đồng bộ hoá với dữ liệu. Việc này sẽ tốn rất nhiều thời gian khi bạn sử dụng vanilla Javascript.
Thật may thây là D3 có cung cấp cho chúng ta một số phương thức có thể giải quyết được vấn đề này một cách đơn giản.

- d3-selection có một phương thức thấy thế cho document.queryselector() được gọi là d3.select(). phương thức này tạo ra một d3-selection object.

Xét đoạn code dưới đây để có thể hiểu rõ hợn:
```
d3.select("#this-other-paragraph")
  .style("color", "cornflowerblue")
  .style("font-style", "italic")
  .style("font-weight", "bold")
  .selectAll("div")
  .data([1, 2, 3, 4, 5])
  .enter().append("div")
  .text(d => d)
```
Một số d3 selections thông dụng:

- .on() & .dispatch() : Phương thức dùng để lắng nghe sự kiện.
- d3.pointer() and d3.touch() : phương thức trả về vị trí của con trỏ.
- .attr() & .style() & .property() : phương thức thây đổi style or thuộc tính của element.
- .text() & .html() : thây đổi text.
- .sort() & .order() & .raise() & .lower() : Phương thức sắp xếp element.
- .transition() :  phương thức tạo ra các animation.

## d3-selection-multi
Như chúng ta đã biết thì d3-selection có hai phương thức giúp chúng ta có thể update styles or attributes cho DOM Element dó là .attr() & .style() . Nhưng nhược điểm của chúng ta chỉ có thể update 1 thuộc tính cho một lần gọi. Thì để giải quyết vấn đề này chúng ta có thể sử dụng một external module (Lưu ý module này không nằm trong d3.js bundle nếu bạn muốn dùng thì phải import nó vào nhé).

Chúng ta xet hai đoạn code sau đây để có thể dể hiêu hơn:
```
d3.select("#this-last-paragraph")
  .style("color", "cornflowerblue")
  .style("font-style", "italic")
  .style("font-weight", "bold")
```
Đoạn code ở trên có thể viết gọn lại khi sử dụng d3-selection-multi
```
d3.select("#this-last-paragraph")
  .styles({
    "color":       "cornflowerblue",
    "font-style":  "italic",
    "font-weight": "bold",
  })
```

## Drawing SVG shapes
Để trừu tượng hoá data, Chúng ta cần phải chuyển data thành graphs. d3 cũng cung cấp một số phương thước để chúng ta có thể vẽ các hình ảnh mong muốn.

 - Arcs : hình cung
 - line : đường thẳng
 - Curves : đường cong
 - Link : Liên kết dùng đề kết nối những điểm vào đồ thị.
 - Symbols : Kí hiệu ( Đối với kí hiệu thì trọng tâm được coi là tạo độ chính của ký hiệu)

Bạn cũng có thể tự tạo ra symbols của mình: https://github.com/d3/d3-shape#custom-symbol-types

## d3-path https://github.com/d3/d3-path
Để tạo ra những hình dáng phức tạp trong svg thì chúng ta có thể sử dụng d attribute string for <path> element.

## d3-polygon Đa giác
d3-polygon là một module nhỏ chứa vài function tiện ích để tạo ra các đa giác.

## d3-scale
a scale (Thang đo) là khái niệm cần biết khi trực quan hoá dữ liệu. Một điều cần thiết khi muốn trực quang hoá dữ liệu là chúng ta cần chuyển những phần dữ liệu lộn xộn ở dạng bảng thành một scale. Scale này sẽ mô tả được một số thông tinh cơ bản như giá trị lớn nhất giá trị nhỏ nhất của dữ liệu đơn vi của dữ liêu... Do đó để tạo ra một scale thì chúng ta cần cung cấp hàm khởi tạo scales (Trong d3 một số hàm khởi tạo scales đặc điểm của chúng là tên bắt đầu bằng scale___ ).


Thông thường có hai loại scale (Ở đây mình hiểu là thang đo) phổ biến là quantitative scales (thang đo định lượng) và ordinal scales (thang đo thứ tự).

Xem ví dụ dưới để có thể hiểu hơn:
```
quantitative scales:

const q_Scale = d3.scaleLinear()
// ở đây chúng ta đã khởi tạo một scale việc tiếp theo là chúng ta cần cung cấp cho scale này hai giá trị. Đó là domain và range.

 q_Scale.domain([0,100])
domain : domain là một hàm nhận vào một mảng chứa hai giá trị tương ứng với min value và max value mà bạn muốn scale thể hiện. Định nghĩa một domain nghĩa là bạn định nghĩa một miền dữ liệu đại diện cho ranh giới mà dữ liệu của bạn nằm trong đó. Và khi bạn có miền dữ liệu rồi thì bạn cần vẽ nó lên màng hình với một độ dài thích hợp để cho người đọc có thể hình dung được. Nhưng độ dài như thế nào là thích hợp. Lúc này thì bạn sẽ cần đến range()

q_Scale.range([0, 500])
range: là hàm để chuyển đổi giá trị này thành giá trị khác tương ứng tỉ lệ. Ở vị dụ trên chúng ta đang chuyển vùng dữ liệu từ 0 -> 100 thành từ 0 -> 500 theo tỉ lệ với nhau. Giá trị
```

```
Ordinal scales:
Đây là một loại scale khác. Dùng cho các trường hợp vùng đữ liệu theo thứ tự. (VD: alphabets)
var ordinal_scale = d3.scale.ordinal(); // Khởi tạo 1 scales
ordinal_scale.domain(['A', 'B', 'C', 'D', 'E']) // Tạo domain cho scale theo alphabets
ordinal_scale.range([0, 200, 400, 600, 800]) // Tạo bởi vì đây là một ordinal_scale nên việc định nghĩa các range cũng sẽ phiền phức hơn. Nhưng may mắn thây là d3 có cũng cấp cho chúng ta một method là rangeBand để đơn giản hoá việc này:
ordinal_scale.range([0, 200, 400, 600, 800])  sẽ tương đương với
ordinal_scale.rangeBands([0, 1000])
```

```
Dùng scales:

ordinal_scale('B') => 200
```
## Dealing with datatimes https://github.com/d3/d3-time-format
Không sớm thì muộn khi vẽ biểu đồ thể nào chúng ta cũng sẽ gặp giá trị là thời gian. Thông thường giá trị này sẽ được tạo thành 1 scales đễ chúng ta có thể minh hoạ một cách trực quang nhất.

d3 cung cấp cho chúng ta 1 số phương thước đẻ format date một các hiệu quả hơn khi kết hợp với new Date() của javascripts.
```
const today = new Date()
const today = d3.timeFormat("%A, %B %d, %Y")(today)
// Saturday, September 11, 2021
```

```
const dateString = "Saturday, September 11, 2021"
const today = d3.timeParse("%A, %B %d, %Y")(dateString)
// <Date> Sat Sep 11 2021 00:00:00 GMT+0700 (Indochina Time)
```
## Animation
```
d3.select("#circle4")
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
  .transition()
    .delay(500)
    .duration(2000)
    .attr("cx", 500)
  .transition()
    .duration(1000)
    .style("fill", "lavender")
  .transition()
    .duration(1000)
    .attr("cx", 50)
    .style("fill", "cornflowerblue")
```

























