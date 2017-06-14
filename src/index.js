'use strict'
const soap = require('soap');
const URL_WS_FACTO='https://conexiondes.facto.cl/documento.php?wsdl';
/**
* Class Facto
* @class Facto
* @constructor
*/
var Facto = function(user,password){
  this.user = user;
  this.password = password;
};

/**
* Validate Header Format
* @return {Boolean} true or false
* @param {Object} header
*  {tipo_dte,fecha_emision,
*  receptor_rut,receptor_razon,receptor_direccion,receptor_comuna,receptor_ciudad,receptor_telefono,
*  receptor_giro,condiciones_pago,receptor_email,orden_compra_num,orden_compra_fecha}
* @private
*/
Facto.prototype._validateHeaderFormat = function _validateHeaderFormat(header){
  console.log(header);
  if(typeof header.tipo_dte != 'undefined'
     && typeof header.fecha_emision != 'undefined'
     && typeof header.receptor_rut != 'undefined'
     && typeof header.receptor_razon != 'undefined'
     && typeof header.receptor_direccion != 'undefined'
     && typeof header.receptor_comuna != 'undefined'
     && typeof header.receptor_ciudad != 'undefined'
     && typeof header.receptor_telefono != 'undefined'
     && typeof header.receptor_giro != 'undefined'
     && typeof header.condiciones_pago != 'undefined'
     && typeof header.receptor_email != 'undefined'
     && typeof header.orden_compra_num != 'undefined'
     && typeof header.orden_compra_fecha != 'undefined')  return true;
   else return false;
}

/**
* Validate DTE Type
* @return {Boolean} true or false
* @param {Number} dte_type
* @private
*/
Facto.prototype._validateDteType = function _validateDteType(dte_type){
  if(dte_type === 33 || dte_type === 34 || dte_type === 39 || dte_type === 41)  return true;
   else return false;
}

/**
* Validate Detail Format
* @return {Boolean} true or false
* @param {Object} details
* [{cantidad,unidad,glosa,monto_unitario,exento_afecto,descuentorecargo_monto (optional),descuentorecargo_porcentaje (optional)}]
* @private
*/
Facto.prototype._validateDetailsFormat = function _validateDetailsFormat(details){
  var correct = true;
  if(details.length === 0) return false;
  for(var i=0;i<details.length;i++){
    var detail = details[i];
    if(typeof detail.cantidad == 'undefined'
      || typeof detail.unidad == 'undefined'
      || typeof detail.glosa  == 'undefined'
      || typeof detail.monto_unitario == 'undefined'
      || typeof detail.exento_afecto == 'undefined'){
        correct = false;
        break;
    }
  }
  return correct;
}

/**
* Validate Totals Format
* @return {Boolean} true or false
* @param {Object} totals
* {descuentorecargo_global_valor,total_exento,total_afecto,total_iva,total_final}
* @private
*/
Facto.prototype._validateTotalsFormat = function _validateTotalsFormat(totals){
  if(typeof totals.descuentorecargo_global_valor != 'undefined'
    && typeof totals.total_exento != 'undefined'
    && typeof totals.total_afecto != 'undefined'
    && typeof totals.total_iva != 'undefined'
    && typeof totals.total_final != 'undefined') return true;
  else return false;
}


/**
* Send document to Facto
* @return {Function} callback with error or Document
* @param {Object} header
*  {tipo_dte,fecha_emision,
*  receptor_rut,receptor_razon,receptor_direccion,receptor_comuna,receptor_ciudad,receptor_telefono,
*  receptor_giro,condiciones_pago,receptor_email,orden_compra_num,orden_compra_fecha,receptor_giro}
* @param {Object} details
* [{cantidad,unidad,glosa,monto_unitario,exento_afecto,descuentorecargo_monto,descuentorecargo_porcentaje}]
* @param {Object} totals
* {descuentorecargo_global_valor,total_exento,total_afecto,total_iva,total_final}
*/
Facto.prototype.SendDocument = function SendDocument(header,details,totals,callback){
  if(!this._validateHeaderFormat(header)) throw new Error('Invalid header')
  if(!this._validateDteType(header.tipo_dte)) throw new Error('Invalid dte type')
  if(!this._validateDetailsFormat(details)) throw new Error('Invalid detail format')
  if(!this._validateTotalsFormat(totals)) throw new Error('Invalid total format')

  var document = {'documento':
                    {
                     'encabezado':header,
                     'detalles':{},
                     'totales':totals
                    }
                };
  var detailsWS = details.map((item)=>{
    return {'detalle':item}
  });
  document.documento.detalles = detailsWS;
  var user = this.user;
  var pass = this.password;
  var auth = "Basic " + new Buffer(user + ':' + pass).toString("base64");
  soap.createClient(URL_WS_FACTO,{ 'wsdl_headers': { 'Authorization': auth }}, function(err, client) {
    if(err){
      return callback(err)
    }
    client.setSecurity(new soap.BasicAuthSecurity(user,pass));
    client.emitirDocumento(document, function(err, result, raw, soapHeader) {
      return callback(err,result)
    })
  });
}

module.exports = Facto;
