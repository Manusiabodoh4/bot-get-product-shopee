class NodeElement {
  constructor(key, value){
    this.key = key
    this.value = value
    this.left = null
    this.right = null
  }
}

const BinarySearchTree = {
  _root: null,
  add(key, value, balance = true) {    
    obj = new NodeElement(key, value)    
    if (this._root) {
      this._assign(this._root, obj);
    } else {
      this._root = obj;
    }
    if (balance) {
      this.balance();
    }
  },
  _assign(node, obj) {
    if (node.key === obj.key) {
      node.value = obj.value;
    } else if (obj.key < node.key) {
      if (node.left) {
        this._assign(node.left, obj);
      } else {
        node.left = obj;
      }
    } else if (obj.key > node.key) {
      if (node.right) {
        this._assign(node.right, obj);
      } else {
        node.right = obj;
      }
    }
  },
  balance(nodes, initial = false) {
    initial = initial || !nodes;
    nodes = nodes || this.toArray();

    if (initial) {
      this._root = null;
    }

    let median = Math.floor(nodes.length/2);
    let left = nodes.slice(0, Math.max(median, 0));
    let right = nodes.slice(median+1);

    this.add(nodes[median].key, nodes[median].value, false);

    if (left.length) {
      this.balance(left);
    }
    if (right.length) {
      this.balance(right);
    }
  },
  remove(key) {
    let nodes = this.toArray();
    let last = nodes.length - 1;

    for (let i = last; i >= 0; i--) {
      if (key === nodes[i].key) {
        nodes.splice(i, 1);
      }
    }
    this.balance(nodes, true);
  },
  search(key) {    

    const returnObj = {
      status : false,
      data : null
    }

    if(this._root === null){
      return returnObj
    }
    let current = this._root
    while(current){      
      if(current.key === key) {
        returnObj.status = true
        returnObj.data = current.value
        return returnObj
      }
      if(key < current.key){
        current = current.left
      }else{
        current = current.right
      }
    }
    return returnObj
  },
  toArray(node) {
    node = node || this._root;
    if (!node) {
      return [];
    }
    let left = node.left ? this.toArray(node.left) : [];
    let right = node.right ? this.toArray(node.right) : [];
    return [...left, node, ...right];
  },
  print(node, level, isFirst) {
    node = node || this._root;
    level = level || 0;
    isFirst = isFirst || [];

    if (level) {
      console.log(isFirst.slice(0,-1).map(state => state ? '│  ' : '   ').join('') + (isFirst[isFirst.length - 1] ? '├──' : '└──') + node.key);
    } else {
      console.log(node.key);
    }

    if (node.left) {
      this.print(node.left, level+1, isFirst.concat(node.right));
    }
    if (node.right) {
      this.print(node.right, level+1, isFirst.concat(false));
    }
  },
  convertTextToNumber(value){
    value = (value||"")
    if(value === "") return 0
    const leng = value?.length
    let total = 0
    for(let i=0;i<leng;i++){
      let partString = value[i]      
      if(partString === "") continue
      total = total + partString.charCodeAt(0)
    }
    return total
  }
};

module.exports = {BinarySearchTree, NodeElement}