import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import {  Login, Papers, Photos, Registration, Services, Sizes, Profile } from '../components/Functions';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom'
import { Store } from '../components/Store';
import { logInOutline, personCircleOutline } from 'ionicons/icons';

const Tab1: React.FC = () => {
//  const [len, setLen] = useState(0)
  const [modal, setModal]   = useState(false)
  const [reg, setReg]       = useState(false)
  const [auth, setAuth]     = useState(false)
  const { name } = useParams<{ name: string; }>();

  let hist = useHistory()

  Store.subscribe({num: 101, type: "auth", func: ()=>{
    setAuth(Store.getState().auth)
    console.log(Store.getState().auth)
  }})

  Store.subscribe({num: 0, type: "route", func: ()=>{
    let route = Store.getState().route;

    if(route === "back") hist.goBack();
    else hist.push(route)

  }})

  function Content():JSX.Element{
    let elem = <></>

    let auth = Store.getState().auth;

    let sw = auth ? name : "login"

    console.log(sw)

    switch(sw) {

      case "root":      elem =  <Services />   ; break;
      case "papers":    elem =  <Papers />     ; break;
      case "sizes":     elem =  <Sizes />      ; break;
      case "gallery":   elem =  <Photos />     ; break;
      default:          elem =  <></>

    }
    
    return elem;

  }

  Store.subscribe({num: -1, type: "details", func: () => {
    let res = Store.getState().details
   // setLen(res.length)
  }})

  function MContent():JSX.Element{
    let elem = <></>
    let auth = Store.getState().auth;

    if(auth){
      console.log("Profile")
      elem = <> 
        <Profile 
          setReg  = { setReg }
          modal   = { setModal }
        />
      </>
    } else {
      if(reg)
        elem = <>
          <Registration 
            setReg = { setReg } 
            modal = { setModal }
          /> 
        </>  
      else 
        elem = <>
          <Login 
            setReg = { setReg } 
            modal = { setModal }
          />
        </>
    }

    return elem;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle> Фото сервисы </IonTitle>
          <IonButton slot="end" fill="clear"
            onClick= {()=>{
              //Store.dispatch({type: "route", route: "/tab1/basket"})
              setModal(true)
            }}
          >
            <IonIcon icon={ 

              auth ? personCircleOutline : logInOutline 

            } slot="icon-only"/>
            {/* <IonText class="red-1"> { len } </IonText> */}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
         <Content /> 
      </IonContent>
      <IonModal 
        isOpen={ modal }
        cssClass= { reg ? 'i-reg' : 'i-login'}
        onDidDismiss={() => setModal(false)}
      >
        <MContent />
      </IonModal>
    </IonPage>

  );
};

export default Tab1;
