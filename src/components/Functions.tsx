import React, { useEffect, useState } from 'react';
import MaskedInput from "../mask/reactTextMask";
import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip
    , IonCol, IonFab, IonFabButton, IonFabList, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonRadio
    , IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonText, IonToolbar } from '@ionic/react';
import { addCircleOutline, arrowForwardOutline, bicycleOutline, businessOutline, cameraOutline
    , cardOutline, cashOutline, checkmarkCircleOutline, closeCircleOutline, homeOutline, imagesOutline, logoGoogle
    , logoInstagram, logOutOutline, phonePortraitOutline, removeCircleOutline, saveOutline, share
    , storefrontOutline, timeOutline } from 'ionicons/icons';
import { usePhotoGallery } from './Gallery';
import { getData, Store } from './Store';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import './Function.css'
import { sortAndDeduplicateDiagnostics } from 'typescript';

declare type Dictionary = {
    [key: string]: any;
  };


export function   Services():JSX.Element {
    const [info, setInfo] = useState<any>([])

    function load(){
        setInfo(Store.getState().services);
    }

    Store.subscribe({num: 1, type: "services", func: () => load()})

    useEffect(()=> load() ,[])

    let elem = <></>

    function Item(props:{info}):JSX.Element{
        let info = props.info;
        let elem = <>
            <IonCard
                onClick={()=>{
                    Store.dispatch({type: "order"
                          , user_id: Store.getState().login.id 
                          , service_id: info.id
                          , service_name: info.name
                    })
                    Store.dispatch({type: "pos", pos: 0})
                    Store.dispatch({type: "route", route: "/tab1/papers"})
                }}
            >
                <IonCardHeader>{ info.name }</IonCardHeader>
                <IonCardContent>
                    <IonItem lines="none">
                        <IonRow>
                            <IonCol size="3">
                                <IonImg
                                    src={ info.image }
                                />
                            </IonCol>
                            <IonCol size="9">
                                <IonItem lines="none">{ info.phone }</IonItem>
                                <IonItem lines="none">{ info.address }</IonItem>
                            </IonCol>
                        </IonRow>
                    </IonItem>
                </IonCardContent>
            </IonCard>
        
        </>
        return elem;
    }

    for(let i = 0;i < info.length;i++){
        elem = <>
            { elem }
            <Item info = { info[i] }/>
        </>
    }

    return elem;
}

export function   Papers():JSX.Element {
    const [info, setInfo] = useState<any>([])

    let order   = Store.getState().order
    let details = Store.getState().details
    let pos     = Store.getState().pos;

    let detail  = {
        order_id:           0,
        paper_id:           0,
        paper_name:         "",
        size_id:            0,
        size_name:          "",
        price:              0,
        fotos:              [],
        thumbs:             [],
    }
    if(pos >= details.length) details = [...details, detail]
    else detail = details[pos]

    function load(){
        let jarr = Store.getState().papers
        let papers: any = []
        jarr.forEach((e)=>{
          if(e.service === order.service_id){
            papers = [...papers, e]
          }    
        })
        setInfo(papers)      
    }

    Store.subscribe({num: 2, type: "papers", func: ()=> load() })

    useEffect(()=> load() ,[])

    let elem = <></>

    for(let i = 0;i < info.length;i++){
      elem = <>
        { elem }
        <IonCard>
          <IonCardHeader> { info[i].name }</IonCardHeader>
          <IonRow>
            <IonCol>
              <IonImg class="img-2" src = { info[i].image }/>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="stacked"> Описание </IonLabel>
                <IonCardSubtitle>{ info[i].description}</IonCardSubtitle>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonItem>
            <IonLabel>Цены с { info[i].min_price } до { info[i].max_price} руб</IonLabel>
          </IonItem>
          <IonToolbar>
            <IonButton slot="end"
              onClick = {()=>{

                detail.paper_id = info[i].id
                detail.paper_name = info[i].name

                Store.dispatch({type: "details", details: details})
                Store.dispatch({type: "route", route: "/tab1/sizes"})
              }}
            >
              Выбрать
            </IonButton>
          </IonToolbar>
        </IonCard>
      </>
    }
    return elem;
}

export function   Sizes():JSX.Element {
    const [info, setInfo] = useState<any>([])
    const [size, setSize] = useState<any>()

    let order = Store.getState().order

    let details = Store.getState().details

    let pos =Store.getState().pos;

    let detail = details[pos];

    function load(){
        let jarr = Store.getState().prices
        let prices: any = []
        jarr.forEach((e)=>{
          if( e.service === order.service_id && e.paper === detail.paper_id ){
            prices = [...prices, e]
          }    
        })
        setInfo(prices)  
    }

    Store.subscribe({num: 3, type: "prices", func: ()=> load() })

    useEffect(()=> load(),[])

    let elem = <></>

    for(let i = 0;i < info.length;i++){
      elem = <>
        { elem }
            <IonItem>
                <IonText> { info[i].size_name } </IonText>
                <IonText slot="end" class="a-right"> { info[i].price } руб. </IonText>
                <IonRadio slot="end" value={ { id: info[i].size, name: info[i].size_name, price: info[i].price } } />
            </IonItem>
      </>
    }
    return <>
        <IonCard>
          <IonCardHeader> Размеры </IonCardHeader>
          <IonRadioGroup value={ size } onIonChange={e => setSize(e.detail.value)}>
              { elem }
          </IonRadioGroup>
          <IonToolbar>
            <IonButton slot="end"
              onClick = {()=>{
                    detail.size_id = size.id
                    detail.size_name = size.name
                    detail.price = size.price

                    Store.dispatch({type: "details", details: details})
                    Store.dispatch({type: "route", route: "/tab1/gallery"})
              }}
            >
              Выбрать
            </IonButton>
          </IonToolbar>
        </IonCard>

    </>;
}

export function   Photos():JSX.Element {
    const [upd, setUpd] = useState(0)
    const {  takePhoto, takePicture } = usePhotoGallery();
    let elem = <></>

    let pos         = Store.getState().pos;
    let details     = Store.getState().details;
    let detail      = details[pos];

    async function getPhoto(){
        let res = await takePhoto()
        detail.fotos = [...detail.fotos, res];

        let img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          let height = 150;
          let width = img.naturalWidth * 150 / img.naturalHeight
          canvas.height = 150;
          canvas.width = width;
          ctx?.drawImage(img, 0, 0, width, height);
          var imageUrl = canvas.toDataURL('image/png');
          detail.thumbs = [...detail.thumbs, imageUrl]
          Store.dispatch({type: "details", details: details})
          setUpd(upd + 1);
        };
    
        img.src = res as string;

    }

    async function getPicture(){
        let res = await takePicture()
        detail.fotos = [...detail.fotos, res];
        Store.dispatch({type: "details", details: details})
        setUpd(upd + 1);
    }
      
    elem = <>
        <IonFab vertical="top" horizontal="start" slot="fixed">
            <IonFabButton>
                <IonIcon icon = { share } />
            </IonFabButton>
            <IonFabList side="end">
                <IonFabButton onClick={()=>{ getPhoto() }}
                ><IonIcon icon={ imagesOutline } /></IonFabButton>
                <IonFabButton onClick={()=>{ getPicture() }} 
                ><IonIcon icon = { cameraOutline } /></IonFabButton>
                <IonFabButton><IonIcon icon = { logoInstagram } /></IonFabButton>
                <IonFabButton><IonIcon icon = { logoGoogle } /></IonFabButton>
            </IonFabList>

        </IonFab>

        <IonFab vertical="top" horizontal="end" slot="fixed">
            <IonFabButton
                onClick={()=>{
                    let pos = Store.getState().pos;
                    Store.dispatch({type: "pos", pos: pos + 1})
                    Store.dispatch({type: "route", route: "/tab1/papers"})
                }}
            >
                <IonIcon icon = { arrowForwardOutline } />
            </IonFabButton>           
        </IonFab>

        <div className="mt-5 i-content">
            {
                detail?.thumbs.map((photo, index) => (
                    <IonCard class="g-photo" key = { index }>
                        <IonCardHeader> Фото </IonCardHeader>
                        <IonImg class="img-1" src={ photo } />
                    </IonCard> 
                ))
            }
        </div>

    </>

    return elem
}

export function   Basket():JSX.Element {
    let elem = <></>

    let details = Store.getState().details

    let sum = 0
    details.forEach(e => {
        sum = sum + e.price * e.fotos.length
    });

    for(let i = 0;i < details.length;i++){ 
        let info = details[i]
        elem = <>
            {  elem }
            <IonItem>
                <IonRow class="r-underline">
                    <IonCol><IonImg id="a-margin" src={info.Картинка}/></IonCol>
                    <IonCol size="8">
                    <IonCardSubtitle> { info.paper_name }, { info.size_name } </IonCardSubtitle>
                    <IonCardTitle> 
                        <IonChip>
                        <IonButton class="i-but" fill="clear" onClick={()=>{
                        // updBasket(info.Код, -1)
                        // setUpd(upd + 1)
                        }}>
                            <IonIcon slot="icon-only" icon={ removeCircleOutline }></IonIcon>
                        </IonButton>
                        { info.fotos.length }
                        <IonButton class="i-but" fill="clear" onClick={()=>{
                            // updBasket(info.Код, 1)
                            // setUpd(upd + 1)
                        }}>
                            <IonIcon slot="icon-only" icon={ addCircleOutline }></IonIcon>
                        </IonButton>
                        { info.price * info.fotos.length }
                        </IonChip>
                    </IonCardTitle>
                    </IonCol>
                    <IonCol size="2">
                    <IonRow>
                        <IonCol class="i-col">
                        <IonButton class="i-but" fill="clear" onClick={()=>{
                            // delBasket(info.Код)
                            // setUpd(upd + 1)
                        }}>
                            <IonIcon slot="icon-only" icon={ closeCircleOutline }>
                            </IonIcon>
                        </IonButton>
                        </IonCol>
                    </IonRow>
                    </IonCol>
                </IonRow>
            </IonItem>
        </>
       
    }

    return <>
        <IonList class="ml-1 mr-1">
            { elem }
            <IonItem>
                <IonText>Итого { sum } руб</IonText>
            </IonItem>
            <IonToolbar>
                <IonButton slot="end"
                    onClick = {()=>{
                        Store.dispatch({type: "route", route: "/tab2/order"})
                    }}
                >
                    Заказать
                </IonButton>
            </IonToolbar>
        </IonList>
    </>
}

export function   Order():JSX.Element {
    const [message, setMessage] = useState("")
    const [mp,    setMP]    = useState(
      Store.getState().order.МетодОплаты === undefined ? true 
        : Store.getState().order.МетодОплаты === "Эквайринг"
    );
    const [dost,  setDost]  = useState(
      Store.getState().order.Доставка === undefined ? true 
        : Store.getState().order.Доставка === "Доставка"
    );
    
    let order = Store.getState().order;
    let details = Store.getState().details
    
    let sum = 0;
    details.forEach(e => {
        sum = sum + e.price * e.fotos.length;
    });

    order.sum       = sum;
    order.total     = sum
  
    let item : Dictionary = {"city": "Якутск"   };
    let dict : Dictionary[] = []; dict.push(item);
    let elem = <>
      <IonCard class="f-card">
        <IonCardHeader> Оформление заказа </IonCardHeader>
        <IonCardContent>
          <IonItem>
              <IonIcon slot="start" icon={ imagesOutline } />
              <IonLabel position="stacked">Сервис</IonLabel>
              <IonText> { order.service_name } </IonText>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" icon={ cardOutline } />
            <IonLabel position="stacked">Оплата</IonLabel>
            <IonSelect value={ order.payment } okText="Okay" cancelText="Dismiss" onIonChange={e => {
                Store.dispatch({type: "order", payment: e.detail.value})
                if(order.payment === "Эквайринг") setMP(true)
                else setMP(false)
            }}>
              <IonSelectOption value="Эквайринг">Эквайринг</IonSelectOption>
              <IonSelectOption value="наличными">Наличными</IonSelectOption>
              <IonSelectOption value="картой">Картой</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonIcon slot= "start" icon={ phonePortraitOutline }/>
            <IonLabel position="stacked">Телефон</IonLabel>
            <MaskedInput
              mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
              className="m-input"
              autoComplete="off"
              placeholder="+7 (914) 000-00-00"
              id='1'
              type='text'
              value = { order.phone }
              onChange={(e: any) => {
                  Store.dispatch({type: "order", phone: (e.target.value as string)})
                }}
            />
          </IonItem>
          <IonItem>
            <IonIcon slot="start" icon={ bicycleOutline } />
            <IonLabel position="stacked">Доставка</IonLabel>
            <IonSelect value={ order.deliver } okText="Okay" cancelText="Dismiss" onIonChange={e => {
                Store.dispatch({type: "order", deliver: e.detail.value})
                order.deliver = e.detail.value

                if(order.deliver === "Доставка") setDost(true); else setDost(false)
            }}>
              <IonSelectOption value="Доставка">Доставка до адреса</IonSelectOption>
              <IonSelectOption value="Самовывоз">Самовывоз</IonSelectOption>
            </IonSelect>
          </IonItem>
          <div className = { dost ? "" : "hide"}>
            <IonItem>
              <IonIcon slot= "start" icon={ timeOutline }/>
              <IonLabel position="stacked">Время доставки</IonLabel>
              <MaskedInput
                mask={[/[1-9]/, /\d/, ':', /\d/, /\d/, ' ', '-', ' ', /\d/, /\d/, ':', /\d/, /\d/,]}
                className="m-input"
                autoComplete="off"
                placeholder="12:00 - 21:00"
                id='2'
                type='text'
                value = { order.time }
                onChange={(e: any) => {
                    order.time = (e.target.value as string);
                    Store.dispatch({type: "order", time: (e.target.value as string)})
                  }}
              />
            </IonItem>
            <IonLabel class="ml-15" >Адрес</IonLabel>
            <AddressSuggestions
              token="23de02cd2b41dbb9951f8991a41b808f4398ec6e"
              filterLocations ={ dict }
              hintText = { "г. Якутск" }
              onChange={(e)=>{
                if(e !== undefined) {
                  order.address   = e.value
                  order.lat       = parseFloat(e.data.geo_lat as string)
                  order.lng       = parseFloat(e.data.geo_lon as string)
                  Store.dispatch({
                      type: "order", 
                      address: e.value, 
                      lat: parseFloat(e.data.geo_lat as string), 
                      lng: parseFloat(e.data.geo_lon as string)
                    })
                }
              }}
            /> 
          </div>
        <IonCardHeader> Итоги по заказу </IonCardHeader>   
          <IonList>
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Сумма доставки </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ order.sumdel } руб</IonLabel>
            </IonItem>
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Заказано на сумму </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ order.sum } руб</IonLabel>
            </IonItem>
            <IonItem class="ml-1" lines="none">
              <IonCardSubtitle>Итого </IonCardSubtitle>
              <IonLabel slot="end" class="a-right">{ order.total } руб</IonLabel>
            </IonItem>
          </IonList>
          <IonRow>
            <IonCol></IonCol>
            <IonCol></IonCol>
            <IonCol>
              <IonButton expand="block"
                onClick = {()=>{
                  Proov();
                }}
              >
                { mp ? "Оплатить" : "Заказать"}
              </IonButton>
            </IonCol>
          </IonRow>
  
        </IonCardContent>
      </IonCard>
      <IonAlert
            isOpen={ message !== "" }
            onDidDismiss={() => setMessage("")}
            cssClass='my-custom-class'
            header={'Ошибка'}
            message={ message }
            buttons={['OK']}
          />
  
    </>
  
    function Proov(){

        let order     = Store.getState().order;
        let details   = Store.getState().details;
      
      if( dost && order.address === "") 
        setMessage("Заполните адрес")
      else 
      if(order.phone === "" || order.phone.indexOf('_') > -1)
        setMessage("Заполните телефон")
      else 
      if(order.payment === "Эквайринг"){
        if(Order(order, details)){
          Store.dispatch({type: "route", route: "/tab2/payment"})
        }
      } else {
        if(Order(order, details)){
          Store.dispatch({type: "route", route: "/tab2/delivery"})
        }
      }
    }
  
    async function Order(order, details){

      let res = await getData("method",   order)

      let id = res[0][0].id

    
      for(let i = 0;i < details.length;i++){
        let detail = details[i]
        detail.method = "order_detail_s"
        detail.order_id = id
//        detail.fotos = ["asd_asd-asdas-234234=-12312ssasasdas", "adasd3rwesfwefdsf-sd23rdsf-sdsdfsas23er"]
//        detail.thumbs = ["asd_asd-asdas-234234=-12312ssas", "adasd3rwesfwefdsf-sd23rdsf-sdsdfs"]

        await getData("method", detail)  
      }
         
      return true
    }
  
    return elem;
}
  
export function   Payment():JSX.Element {

  let order = Store.getState().order;
  let elem = <></>

  elem =<>
    <IonCard class="f-card">
      <IonCardHeader> Эквайринг </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonIcon slot="start" icon={ cardOutline } />
          <IonLabel > Сумма к оплате </IonLabel>
          <IonText> { order.total } руб </IonText>
        </IonItem>
        <IonRow>
          <IonCol></IonCol>
          <IonCol></IonCol>
          <IonCol>
            <IonButton
              onClick = {()=>{
                //  IPAY({api_token: 'v32e4mhbmbcu0o7ts1l2ps9ii5'});
                //    ipayCheckout({
                //      amount: Store.getState().order.СуммаВсего,
                //      currency:'RUB',
                //      order_number:'',
                //      description: 'Оплата по заказу '},
                //      function(order) { showSuccessfulPurchase(order) },
                //      function(order) { showFailurefulPurchase(order) })  
                Store.dispatch({type: "route", route: "/tab2/delivery"})
              }}
            >
              Оплатить
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  </>

function        showSuccessfulPurchase(order){
  console.log("success")
  console.log(order)
 // createDoc()
}

function        showFailurefulPurchase(order){
  console.log("failure")
  console.log(order)
}


  return elem;
}

export function   Delivery():JSX.Element {

  let order = Store.getState().order;
  let elem = <>
    <IonCard class="f-card">
      <IonCardHeader> Заказ </IonCardHeader>
      <IonCardContent>
        <IonList>
        <IonItem>
            <IonItem lines="none">
              <IonIcon slot="start" icon = { businessOutline }/>
              <IonLabel position="stacked"> Организация </IonLabel>
              <IonText><b> { order.serviсe_name } </b></IonText>
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem lines="none">
              <IonIcon slot="start" icon = { bicycleOutline }/>
              <IonLabel position="stacked"> Доставка </IonLabel>
              <IonText><b> { order.deliver } </b></IonText>
            </IonItem>
          </IonItem>
          <IonItem className={ order.deliver === "Доставка" ? "" : "hide"}>
            <IonItem lines="none">
              <IonIcon slot="start" icon = { homeOutline }/>
              <IonLabel position="stacked"> Адрес доставки </IonLabel>
              <IonText><b> { order.address } </b></IonText>
            </IonItem>
          </IonItem>
          <IonItem className={ order.deliver === "Доставка" ? "hide" : ""}>
            <IonItem lines="none">
              <IonIcon slot="start" icon = { storefrontOutline }/>
              <IonLabel position="stacked"> Забирать с адреса </IonLabel>
              <IonText><b> { order.address } </b></IonText>
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem lines="none">
              <IonIcon slot="start" icon = { cashOutline }/>
              <IonLabel position="stacked"
                className={ order.payment === "Эквайринг" ? "hide" : ""}
              > Оплата { order.payment } </IonLabel>
              <IonText
                className={ order.payment === "Эквайринг" ? "hide" : ""}
              ><b> Заказано на сумму { order.total } руб </b></IonText>
              <IonText
                className={ order.payment === "Эквайринг" ? "" : "hide"}
              ><b> Оплачено { order.total } руб </b></IonText>
            </IonItem>
          </IonItem>
          <IonItem className={ order.deliver === "Доставка" ? "hide" : ""}>
           <IonText class="text-1">
              Вы можете забрать свой заказ с указанного адреса в рабочее время течение трех дней.
              Потом заказ будет отменен. 
              <span className={ order.payment === "Эквайринг" ? "" : "hide"}>
                Деньги будут возвращены на карту
              </span>
           </IonText>
          </IonItem>
          <IonItem className={ order.deliver === "Доставка" ? "" : "hide"}>
           <IonText class="text-1">
             Ближайшее время с вами свяжутся и обговорят время доставки вашего заказа
           </IonText>
          </IonItem>
        </IonList>
        <IonRow>
          <IonCol></IonCol>
          <IonCol></IonCol>
          <IonCol>
            <IonButton
              onClick = {()=>{  
                //Order();
                Store.dispatch({type: "route", route: "/tab1/root"})
              }}
            > Закрыть
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  </>

  return elem;
}

export function   Login(props):JSX.Element {
  const [load, setLoad] = useState(false)
 let log = {
    phone:  "",
    pass:   "",
  }

  let elem = <></>

  async function login(){
    if(log.phone !== "" && log.phone.indexOf('_') === -1){
      if(log.pass !== ""){
       // log.phone = phone(log.phone)
        let param = {
          method: "login_s",
          phone:  log.phone,
          pass:   log.pass,
        }
        setLoad(true);
        let res = await getData("method", param)
        if(res[0].length > 0){
          let login = res[0][0]
          login.type = "login"
          Store.dispatch({type: "auth", auth: true})
          Store.dispatch( login )
          props.modal(false)
        }
        setLoad(false);
      }  
    }
  }

  elem = <>
    <IonLoading isOpen={ load } message="Вход..." />
    <IonCard>
      <IonCardHeader> Вход </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonLabel position="stacked"> Логин </IonLabel>
          <MaskedInput
              mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
              className="m-input"
              autoComplete="off"
              placeholder="+7 (914) 000-00-00"
              id='1'
              type='text'
              onChange={(e: any) => {
                  log.phone = (e.target.value as string)
                }}
            />

        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> Пароль </IonLabel>
          <IonInput
            type = "password"
            onIonChange= {(e)=>{
              log.pass = (e.detail.value as string)     
            }}
          />
        </IonItem>
        <IonRow>
          <IonText class="w-100 a-link"
            onClick={()=>{
              props.setReg(true)
            }}
          > Регистрация </IonText>
        </IonRow>

        <IonToolbar>
          <IonButton slot="end"
            onClick= {()=>{
              login()
            }}
          >
            Вход
          </IonButton>
        </IonToolbar>
      </IonCardContent>
    </IonCard>
  </>

  return elem
}

export function   Registration(props):JSX.Element {
  const [s_alert, setSAlert] = useState(false)
  const [e_alert, setEAlert] = useState(0)

  let login = Store.getState().login;
  let str: any

  async function reg(){
    if(login.phone !== "" && login.phone.indexOf('_') === -1){
      if(login.pass === login.pass1){
        login.method = "registration"
        login.role = 0
        login.image = ''
        let res = await getData("method", login)
        console.log(res)
        if(res[0].length > 0) 
          str = res[0][0]
          if(str.auth === 0) setEAlert(3)
          else {
            Store.dispatch({type: "login", login: str})
            props.setReg(false)
          }        

      } else setEAlert(2)

    } else setEAlert(1)
   
  }

  let elem = <>
    <IonCard>
      <IonCardHeader> Регистрация </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonLabel position="stacked"> Телефон </IonLabel>
          <MaskedInput
              mask={['+', /[1-9]/, ' ','(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-',/\d/, /\d/]}
              className="m-input"
              autoComplete="off"
              placeholder="+7 (914) 000-00-00"
              id='1'
              type='text'
              onChange={(e: any) => {
                  login.phone = (e.target.value as string)
                }}
            />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> ФИО </IonLabel>
          <IonInput
            onIonChange = {(e)=>{
              login.fio = (e.detail.value)
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> элПочта </IonLabel>
          <IonInput 
            onIonChange = {(e)=>{
              login.email = (e.detail.value)
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> Пароль </IonLabel>
          <IonInput 
            type="password"
            onIonChange = {(e)=>{
              login.pass = (e.detail.value)
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> Подтверждение </IonLabel>
          <IonInput 
            type="password"
            onIonChange = {(e)=>{
              login.pass1 = (e.detail.value)
            }}
          />
        </IonItem>
        <IonToolbar>
          <IonButton slot="start" expand="block"
            onClick={()=> props.setReg(false)}
          >
            Отмена
          </IonButton>
          <IonButton slot="end" expand="block"
            onClick={()=> {
              reg()
              Store.dispatch({type: "login", login: login})                
            }}
          >
            Сохранить
          </IonButton>
        </IonToolbar>
      </IonCardContent>
    </IonCard>
    <IonAlert
      isOpen={ s_alert }
      onDidDismiss={() => setSAlert( false )}
      cssClass='my-custom-class'
      header={'Успех'}
      message={'Вы успешно зарегистрированы'}
      buttons={['Ok']}
    />
    <IonAlert
      isOpen={ e_alert === 1 }
      onDidDismiss={() => setEAlert( 0 )}
      cssClass='my-custom-class'
      header={'Ошибка'}
      message={'Заполните телефон'}
      buttons={['Ok']}
    />
    <IonAlert
      isOpen={ e_alert === 2 }
      onDidDismiss={() => setEAlert( 0 )}
      cssClass='my-custom-class'
      header={'Ошибка'}
      message={'Пароли не совпадают'}
      buttons={['Ok']}
    />
    <IonAlert
      isOpen={ e_alert === 3 }
      onDidDismiss={() => setEAlert( 0 )}
      cssClass='my-custom-class'
      header={'Ошибка'}
      message={'Пользователь уже зарегистрирован'}
      buttons={['Ok']}
    />
  </>

  return elem

}

export function   Profile(props):JSX.Element {
  const [upd, setUpd] = useState(0)
  
  let login = Store.getState().login;
  
  console.log(login)
  
  let str: any

  Store.subscribe({num: 4, type: "login", func: ()=>{
    //login = Store.getState().login
    setUpd(upd + 1)
  }})

  async function save(){

    login.method = "user_s"
    login.role = 0
    login.image = ''

    let res = await getData("method", login)
    
    if(res[0].length > 0) 
    str = res[0][0]
    Store.dispatch({type: "login", login: str})
   
  }

  let elem = <>
    <IonCard>
      <IonCardHeader> Профиль </IonCardHeader>
      <IonCardContent>
        <IonItem>
          <IonLabel position="stacked"> ФИО </IonLabel>
          <IonInput
            value = { login.fio }
            onIonChange = {(e)=>{
              login.fio = (e.detail.value)
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked"> элПочта </IonLabel>
          <IonInput 
            value = { login.email }
            onIonChange = {(e)=>{
              login.email = (e.detail.value)
            }}
          />
        </IonItem>
        <IonToolbar>
        <IonButton slot="end" expand="block"
            onClick={()=> {
              Store.dispatch({type: "auth", auth: false})
              props.modal(false)
            }}
          >
            <IonIcon icon = { logOutOutline } slot="icon-only" />
          </IonButton>
          <IonButton slot="end" expand="block"
            onClick={()=> props.modal(false)}
          >
            <IonIcon icon = { closeCircleOutline } slot="icon-only" />
          </IonButton>
          <IonButton slot="end" expand="block"
            onClick={()=> {
              save()
              Store.dispatch({type: "login", login: login})                
            }}
          >
            <IonIcon icon = { checkmarkCircleOutline } slot="icon-only" />
          </IonButton>
        </IonToolbar>
      </IonCardContent>
    </IonCard>
  </>

  return elem

}