import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';
import { Store } from '../components/Store';
import { Basket, Delivery, Order, Payment } from '../components/Functions';
import { useParams } from 'react-router';

const Tab2: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  let order = Store.getState().order;

  console.log("tab2")

  function Content():JSX.Element {
    console.log(order)
    let elem = <></>

    switch(name) {
      case "basket":    elem =  <Basket />;     break;
      case "order":     elem =  <Order /> ;     break
      case "delivery":  elem =  <Delivery /> ;  break
      case "payment":   elem =  <Payment /> ;   break
    }
    return elem;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Заказ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Content />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
