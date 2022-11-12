const initState = false; //初始化状态
export default function CollapsedReducer(preState = initState, action) {
    //从action中获取type,data
    const { type,data } = action;
    switch (type) {
        case "change_loading":
           return data
        default:
          return preState;
      }
  }
  