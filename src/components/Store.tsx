import { combineReducers  } from 'redux'
import axios from 'axios'
import { Reducer } from 'react';

interface t_list {
    num: number, type: string, func: Function,
}

var reducers: Array<Reducer<any, any>>;reducers = []

export const i_state = {

    auth:                   false,
    route:                  "",
    login:                  {
        id:                 0,
        phone:              "",
        fio:                "",
        email:              "",
        pass:               "",
        role:               0,
        image:              "",    
    },
    order:                  {
        user_id:            0,
        method:             "orders_s",
        service_id:         0,
        service_name:       "",
        status:             "Создан",
        phone:              "",
        deliver:            "Доставка",
        payment:            "Эквайринг",
        address:            "",
        lat:                0,
        lng:                0,
        time:               "",
        sumdel:             "",
        sum:                0.00,
        total:              0.00,
    },
    details:                [],
    papers:                 [],
    prices:                 [],
    services:               [],
    pos:                    0,
}


for(const [key, value] of Object.entries(i_state)){
    reducers.push(
        function (state = i_state[key], action) {
            switch(action.type){
                case key: {
                    if(typeof(value) === "object"){
                        if(Array.isArray(value)) {
                            return action[key]
                        } else {
                            let data: object; data = {};
                            for(const key1 of Object.keys(value)){ 
                                data[key1] = action[key1] === undefined ? state[key1] : action[key1]
                            }   
                            return data
                        }

                    } else return action[key]
                }
                default: return state;
            }       
        }

    )
}

export async function   getData(method : string, params){

    let res = await axios.post(
            URL + method, params,
            {
                auth: {
                    username: unescape(encodeURIComponent("МФО_Админ")),
                    password: unescape(encodeURIComponent("1234"))
                },
            }
        ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}

function                create_Store(reducer, initialState) {
    var currentReducer = reducer;
    var currentState = initialState;
    var listeners: Array<t_list>; listeners = []
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listeners.forEach((elem)=>{
                if(elem.type === action.type){
                    elem.func();
                }
            })
            return action;
        },
        subscribe(listen: t_list) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === listen.num; 
            });
            if(ind >= 0){
                listeners[ind] = listen;
            }else{
                listeners = [...listeners, listen]
            }
 
        }
    };
}

const                   rootReducer = combineReducers({

    auth:           reducers[0],
    route:          reducers[1],
    login:          reducers[2],
    order:          reducers[3],
    details:        reducers[4],
    papers:         reducers[5],
    prices:         reducers[6],
    services:       reducers[7],
    pos:            reducers[8],

})

export const Store   =  create_Store(rootReducer, i_state)


export const URL = "http://89.208.211.109:3000/"


export async function getDatas(){
}


async function exec(){

    let res = await getData("method", {method: "services"})
    if(res[0] !== undefined) 
        Store.dispatch({type: "services", services: res[0]})


    res = await getData("method", {method: "papers_j" });
    Store.dispatch({type: "papers", papers: res[0]})

    res = await getData("method", {method: "prices" });
    Store.dispatch({type: "prices", prices: res[0]})

}


exec();

