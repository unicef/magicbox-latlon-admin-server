exports.splitPairs = function(arr) {
  var pairs = [];
  for (var i = 0; i < arr.length; i += 2) {
    if (arr[i + 1] !== undefined) {
      pairs.push([arr[i], arr[i + 1]]);
    } else {
      pairs.push([arr[i]]);
    }
  }
  return pairs;
};
