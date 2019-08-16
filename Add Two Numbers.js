// Add Two Numbers  
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    let arr1 = [],arr2 = [];
    let getArr = function(arr,result) {
        if (arr.next) {
            getArr(arr.next,result)
        } 
        result.push(arr.val)
    }
    let getList = function(item){
    	let status = item.next()
    	if (status.done) {
    		return null
    	} else {
    		let obj = {
	    		val : status.value,
	    		next : getList(item)
	    	}
	    	return obj
    	}
    }
    getArr(l1,arr1)
    getArr(l2,arr2)
    let result = (parseInt(arr1.join('')) + parseInt(arr2.join('')) + '').split('').reverse()
    let iii = result.map(i => parseInt(i))
    let generator = (function* (){ yield* iii})()
    return getList(generator)
};