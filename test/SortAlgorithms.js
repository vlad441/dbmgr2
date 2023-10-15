module.exports={quickSortv2,};
function Sort(obj, options={}){
	
}

function quickSort_v1(array){
  if (array.length <= 1) { return array; }
  var pivot = array[0]; var left = []; var right = [];
  for (var i = 1; i < array.length; i++){
    array[i] < pivot ? left.push(array[i]) : right.push(array[i]);
  } return quickSort_v1(left).concat(pivot, quickSort_v1(right));
};

function _getNestedValue(obj, path){ return obj; }

// ================================ quickSort_v2 =========================================
function qs_swap(items, leftIndex, rightIndex){ let temp = items[leftIndex]; items[leftIndex] = items[rightIndex]; items[rightIndex] = temp; }
function qs_partition(items, left, right){ let pivot = items[Math.floor((right + left) / 2)], i = left, j = right;
    while (i <= j) {
        while (items[i] < pivot){ i++; }
        while (items[j] > pivot){ j--; }
        if (i <= j){ qs_swap(items, i, j); i++; j--; }
    } return i; }

function quickSortv2(items, left, right){ let index;
    if (items.length > 1){
        index = qs_partition(items, left, right);
        if (left < index - 1) { quickSortv2(items, left, index - 1); }
        if (index < right) { quickSortv2(items, index, right); }
    } return items; }
// ================================ quickSort_v2_1 (by GPT) =========================================
function quickSortv2_1(items, sortField, sortOrder){
    const stack = []; let left = 0, right = items.length - 1;

    const qs_swap = (items, leftIndex, rightIndex) => {
        const temp = items[leftIndex];
        items[leftIndex] = items[rightIndex];
        items[rightIndex] = temp;
    };
    stack.push(left, right);

    while (stack.length){ right = stack.pop(); left = stack.pop();
        const pivotIndex = Math.floor((left + right) / 2);
        const pivot = _getNestedValue(items[pivotIndex], sortField);
        let i = left, j = right;

        while (i <= j) {
            if (sortOrder >= 0){
                while (_getNestedValue(items[i], sortField) < pivot) i++;
                while (_getNestedValue(items[j], sortField) > pivot) j--;
            } else {  // sortOrder is -1
                while (_getNestedValue(items[i], sortField) > pivot) i++;
                while (_getNestedValue(items[j], sortField) < pivot) j--;
            }
            if (i <= j){ qs_swap(items, i, j); i++; j--; }
        }
        if (left < j) { stack.push(left, j); }
        if (i < right){ stack.push(i, right); }
    } return items;
}
// ================================ Others =========================================
function TopSearch(arr, count){ let max=0; for(let i in arr){ if(arr[i]>max){ max=arr[i]; } } return max; } //использ. если менее 400к элементов
function ObjEntries(obj){ let arr=[]; for(let key in obj){ arr.push([key,obj[key]]); } return arr; } //использ. если более 400к элементов
// ================================  =========================================
let params={elems:1000000};

function test(){ let elems=params.elems;
  let performance = require('perf_hooks').performance; arr1 = []; arr2 = [];
  for (i=0;i<elems;i++){ arr1.push(Math.random()); arr2.push(Math.random()); } let time1, sArr;

  console.log("=== Performance ArraySort tests == Elements:",elems); time1 = performance.now();
  arr1.sort(function(a,b){return a-b;});
  console.log("nativeSort:", performance.now()-time1, "ms");

  arr1 = []; for(i=0;i<elems;i++){ arr1.push(Math.random()); } time1 = performance.now();
  sArr = quickSort_v1(arr1);
  console.log("quickSort_v1:", performance.now()-time1, "ms");
  console.log(" (start values:", arr1[0], arr1[1], arr1[2], "; ready values:", sArr[0], sArr[1], sArr[2]);

  arr1 = []; for(i=0;i<elems;i++){ arr1.push(Math.random()); } time1 = performance.now();
  sArr = quickSortv2(arr1, 0, elems-1);
  console.log("quickSortv2:", performance.now()-time1, "ms");
  console.log(" (start values:", arr1[0], arr1[1], arr1[2], "; ready values:", sArr[0], sArr[1], sArr[2], sArr[3], sArr[4], "| Length:", sArr.length, arr2.length);
  
  arr1 = []; for(i=0;i<elems;i++){ arr1.push(Math.random()); } time1 = performance.now();
  sArr = quickSortv2_1(arr1, 0, -1);
  console.log("quickSortv2_1:", performance.now()-time1, "ms");
  console.log(" (start values:", arr1[0], arr1[1], arr1[2], "; ready values:", sArr[0], sArr[1], sArr[2], sArr[3], sArr[4], "| Length:", sArr.length, arr2.length);

  arr1 = []; for(i=0;i<elems;i++){ arr1.push(Math.random()); } time1 = performance.now();
  sArr = TopSearch(arr1, 0, elems-1);
  console.log("TopSearch:", performance.now()-time1, "ms");
  console.log(" (start values:", arr1[0], arr1[1], arr1[2], "; ready values:", sArr);
}

function test2(){ let elems=params.elems;
  let performance = require('perf_hooks').performance; obj1 = {}; obj2 = {};
  for (i=0;i<elems;i++){ obj1[i]={cash:Math.random(), descr:"Zero"}; obj2[i]={cash:Math.random(), descr:"Zero"}; }

  console.log("=== Performance ObjectSort tests == Elements:",elems); let time1;

  time1 = performance.now(); Object.entries(obj1);
  console.log("Object.entries:", performance.now()-time1, "ms");
  time1 = performance.now(); let resp=ObjEntries(obj1);
  console.log("ObjEntries:", performance.now()-time1, "ms"); console.log(resp[0], resp[1], resp[2], resp[3]);

  time1 = performance.now();
  let resp_sort = Object.entries(obj1).sort((a,b) => a[1].cash-b[1].cash);
  let nvtime = performance.now()-time1; console.log("nativeSort:", nvtime, "ms");
  //console.log(" (start values:", obj1[0], obj1[1], obj1[2], ";resp_sort:", resp_sort);
}
test();
//test2();

/* https://www.kontrolnaya-rabota.ru/s/grafik/tochka/ x1 - nativesort; x2 - v1; x3 - v2
x;y1;y2;y3
100000;61.59;64.99;35.93
1000000;636.84;489.02;150.77
2000000;1781.25;1151.41;313.54
5000000;7817;2901;797
7000000;12791;4051;1183
10000000;23506;5868;1637
*/
