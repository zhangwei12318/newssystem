const initState = false; //初始化状态
export default function CollapsedReducer(preState = initState, action) {
    //从action中获取type,data
    const { type } = action;
    switch (type) {
        case "change_collapsed":
           let newCollapsed=!preState
           return newCollapsed
        default:
          return preState;
      }
  }
  