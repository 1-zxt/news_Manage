export const CollApsedReducer = (prevState = {
     isCollapsed: false
}, action) => {
     // console.log(action);
     // 打印出来topheader中mapDispatchToProps帮忙dispatch的返回值

     let { type } = action

     switch (type) {
          case "change_collapsed":
               // 深复制
               let newstate = { ...prevState }
               newstate.isCollapsed = !newstate.isCollapsed
               return newstate
          default:
               return prevState
     }


} 