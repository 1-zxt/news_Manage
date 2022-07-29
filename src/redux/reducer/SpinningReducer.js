export const SpinningReducer = (prevState = {
     isSpinning: false
}, action) => {
     let { type, payload } = action

     switch (type) {
          case "change_spinning":
               let newstate = { ...prevState }
               newstate.isSpinning = payload
               return newstate
          default:
               return prevState
     }

}