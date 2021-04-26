import { react } from "babel-types";

import React from "react";

class App extends React.Component {
   constructor(props){
      super(props);
      this.loop = undefined;
   }

   state = {
      breakCount: 5,
      sessionCount: 25,
      clockCount: 25 * 60,
      currentTimer: 'Session',
      isPlaying:false,
      loop:undefined
   }
   //======================================btn Play=====================================================

   //permet le décompte du compteur qd on appuie sur le bouton play
   handlePlayPause = () => {
      const { isPlaying } = this.state;
      if(isPlaying) {
         clearInterval(this.loop);
         this.setState({
            isPlaying : false
         })
      } else {
         this.setState({
            isPlaying : true
         })
         this.loop = setInterval(() => {
            const { clockCount } = this.state;

            this.setState({
               clockCount : clockCount - 1
            })
         }, 1000);
      }
      
   }

   componentWillUnmount(){
      clearInterval(this.loop);
   }
   
   //permet d'afficher le compteur sous le bon format, minutes secondes
   convertToTime = (count) => {
      const minutes = Math.floor(count/60);
      let seconds = count % 60;
      seconds = seconds < 10 ? ('0'+seconds): seconds;
      return `${minutes}:${seconds}`;
   }
  
   render() { // fct qu on renvoi au fichier app.js
      const { 
         breakCount, 
         sessionCount, 
         clockCount, 
         currentTimer 
      } = this.state;

      const breakProps = {
         title: 'Break length',
         count: breakCount,
         handleDecrease: this.handleBreakDecrease,
         handleIncrease: this.handleBreakIncrease
      }

      const sessionProps = {
         title: 'Session length',
         count: sessionCount,
         handleDecrease: this.handleSessionDecrease,
         handleIncrease: this.handleSessionIncrease
      }

      return ( // ce qui sera affiché à l'écran
         <div>
            <div class="flex">
               <SetTimer {...breakProps} />
               <SetTimer {...sessionProps} />
            </div>
            <div class="clock-container">
               <h1>{currentTimer}</h1>
               <span>{this.convertToTime(clockCount)}</span>
               <div class="flex">
                  <button onClick={this.handlePlayPause}>
                     <i class="fas fa-play"/>
                  </button>
                  <button onClick={this.handleReset}>
                     <i class="fas fa-sync"/>
                  </button>
               </div>
            </div>
         </div >)
   }
}

//fct qui génere l'affichage du contenu de la page (cpteur, btn, title...)
const SetTimer = (props) =>
(
   <div class="timer-count">
      <h1>{props.title}</h1>
      <div class="flex actions-wrapper">
         <button onClick={props.handleDecrease}>
            <i class="fas fa-minus"  />
         </button>
         <span>{props.count}</span>
         <button onClick={props.handleIncrease}>
            <i class="fas fa-plus"/>
         </button>
      </div>
   </div>
)


export default App