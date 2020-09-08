# overkiz-api

[![npm version](https://badge.fury.io/js/overkiz-api.svg)](https://badge.fury.io/js/overkiz-api)
[![npm downloads](https://badgen.net/npm/dt/overkiz-api)](https://badgen.net/npm/dt/overkiz-api)

overkiz-api is a Node.js library that implements the Overkiz IoT API

## Installation
`npm install --save overkiz-api`

## Some usage

Retrieves all house 

```typescript
async function fetchAllHouse(): Promise<Setup> {
    const api: API = new API({
        host: 'ha110-1.overkiz.com', // Cozytouch host
        user: 'XXX', // your user account
        password: 'XXX', // your password
        polling: {
            always: false,
            interval: 1000
        }
    });
    return api.getSetup();
}
// Execute the task
fetchAllHouse()
    .then(console.log)
    .catch(console.error)
```

Get all devices of type 'WaterHeatingSystem'

```typescript
async function getAllWaterHeatingSystem(): Promise<APIObject[]> {
    const api: API = new API({
        host: 'ha110-1.overkiz.com', // Cozytouch host
        user: 'XXX', // your user account
        password: 'XXX', // your password
        polling: {
            always: false,
            interval: 1000
        } 
    });
    const objects: APIObject[] = await api.getObjects();
    return objects.filter((o) => o.uiClass === 'WaterHeatingSystem');
}
// Execute the task
getAllWaterHeatingSystem()
    .then(console.log)
    .catch(console.error)
```

Change device name

```typescript
async function changeName(): Promise<boolean> {
    const objects: APIObject[] = await getAllWaterHeatingSystem(); // call the previous function
    const obj = objects.find((o) => o.hasCommand('setName'));
    if(obj !== undefined) {
        return obj.exec({
            name: 'setName',
            parameters: [
                'HelloWorld'
            ]
        });
    }
    return false;
}
// Execute the task
changeName()
    .then(console.log)
    .catch(console.error)
```
