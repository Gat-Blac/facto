#facto
=========

[![npm package](https://nodei.co/npm/facto-api.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/facto-api/)

A library providing methods to use all facto apis

## Installation

  npm install facto --save

## Usage
### SendDocument
Use to send a document to SII using the facto apis
```javascript
var Facto = require('facto-api');
var facto = new Facto('username','password');
var header = {
  'tipo_dte':33,
  'fecha_emision':'2017-06-22',
  'receptor_rut':'16338637-2',
  'receptor_razon':'GAT-BLAC',
  'receptor_direccion':'Huerfanos',
  'receptor_comuna':'Santiago',
  'receptor_ciudad':'Santiago',
  'receptor_telefono':'+56961408655',
  'receptor_giro':'sadsa',
  'condiciones_pago':'0',
  'receptor_email':'alex.berrocal@gat-blac.com',
  'orden_compra_num':1,
  'orden_compra_fecha':'2017-06-22',
  };
var details = [{
  'cantidad':1,
  'unidad':1,
  'glosa':'sadsa',
  'monto_unitario':100,
  'exento_afecto':1,
  'descuentorecargo_monto':0
}];
var totals = {
  'descuentorecargo_global_valor':0,
  'total_exento':0,
  'total_afecto':100,
  'total_iva':19,
  'total_final':119
}
facto.SendDocument(header,details,totals,(err,result)=>{
  if(err){
    console.error('ERROR',err)
  }else{
    console.log('RESULT',result);
  }
});
```
## Tests

  npm test

# References

- [Webpage API](http://www.gat-blac.com)

## Release History

* 1.0.0 Initial release
