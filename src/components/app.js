import { react } from "babel-types";

import React from "react";
//import modal from "modal";
const audio = document.getElementById('beep');

class App extends React.Component {
   state = {
      breakCount: 5,
      sessionCount: 25,
      clockCount: 3,
      currentTimer: 'Session',
      isPlaying: false,
      loop: undefined,
      //modal: new modal(),
   }

   constructor(props) {
      super(props);
      this.loop = undefined;
   }
   componentWillUnmount() {
      clearInterval(this.loop);
   }
   //=======================btn Play & Reset=====================================================

   //permet le décompte du compteur avec btn play
   handlePlayPause = () => {
      const { isPlaying } = this.state;
      if (isPlaying) {
         clearInterval(this.loop);
         this.setState({
            isPlaying: false
         })
      } else {
         this.setState({
            isPlaying: true
         })
         this.loop = setInterval(() => {
            const {
               clockCount,
               currentTimer,
               breakCount,
               sessionCount
            } = this.state;

            if (clockCount === 0) {
               this.setState({
                  currentTimer: (currentTimer === 'Session') ? 'break' : 'Session',
                  clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
               });
               audio.play();
               //modal.handleOpenModal();
            } else {
               this.setState({
                  clockCount: clockCount - 1
               });
            }
         }, 1000);
      }
   }
   //---------------------------------------------------------------------------------------------------------------

   //btn reset, remet le cpt au point de depart
   handleReset = () => {
      this.setState({
         breakCount: 5,
         sessionCount: 25,
         clockCount: 25 * 60,
         currentTimer: 'Session',
         isPlaying: false,
      })
      clearInterval(this.loop);
      audio.pause;
      audio.currentTime = 0;
   }

   //permet d'afficher le compteur sous le bon format, minutes secondes
   convertToTime = (count) => {
      const minutes = Math.floor(count / 60);
      let seconds = count % 60;
      seconds = seconds < 10 ? ('0' + seconds) : seconds;
      return `${minutes}:${seconds}`;
   }
   //===========================btn down & Up=============================================================
   handleLengthChange = (count, timerType) => {
      const {
         sessionCount,
         breakCount,
         isPlaying,
         currentTimer
      } = this.state
      let newCount;

      if (timerType === 'session') {
         newCount = sessionCount + count;
      } else {
         newCount = breakCount + count;
      }

      if (newCount > 0 && newCount < 61 & !isPlaying) {
         this.setState({
            [`${timerType}Count`]: newCount,
         })

         if (currentTimer.toLowerCase() === timerType) {
            this.setState({
               clockCount: newCount * 60
            })
         }
      }
   }
   //--------------------------------------------------------------------------------------------------
   

   // fct envoyer au fichier app.js
   render() {
      const {
         breakCount,
         sessionCount,
         clockCount,
         currentTimer,
      } = this.state;

      const breakProps = {
         title: 'Break ',
         count: breakCount,
         handleDecrease: () => this.handleLengthChange(-1, 'break'),
         handleIncrease: () => this.handleLengthChange(1, 'break')
      }

      const sessionProps = {
         title: 'Session ',
         count: sessionCount,
         handleDecrease: () => this.handleLengthChange(-1, 'session'),
         handleIncrease: () => this.handleLengthChange(1, 'session')
      }

      return ( // ce qui sera affiché à l'écran
         <div>
            <div className="flex">
               <SetTimer {...breakProps} />
               <SetTimer {...sessionProps} />
            </div>
            <div className="clock-container">
               <h1 id="timer-label">
                  {currentTimer}
               </h1>
               <span id="time-left">
                  {this.convertToTime(clockCount)}
               </span>

               <div className="flex">
                  <button id="start_stop"
                     onClick={this.handlePlayPause}>
                     <i className="fas fa-play" ></i>
                     <i className="fa fa-pause" aria-hidden="true"></i>
                  </button>
                  <button id="reset"
                     onClick={this.handleReset}>
                     <i className="fas fa-sync" />
                  </button>
               </div>
            </div>
         </div >)
   }
}

//fct qui génere l'affichage du contenu de la page (cpteur, btn, title...)
const SetTimer = (props) => {
   const id = props.title.tolowerCase;
   return (
      <div className="timer-count">
         <h2 id={`${id}-label`} >
            {props.title} Length
         </h2>
         <div className="flex actions-wrapper">
            <button id={`${id}-decrement`}
               onClick={props.handleDecrease}>
               <i className="fas fa-minus" />
            </button>
            <span id={`${id}-length`}>
               {props.count}
            </span>
            <button id={`${id}-increment`}
               onClick={props.handleIncrease}>
               <i className="fas fa-plus" />
            </button>
         </div>
      </div>
   )
}

export default App