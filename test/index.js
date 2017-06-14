var should = require('chai').should();
var Facto = require('../index');
var facto = new Facto('76290502-7','test');

describe('#Facto',function(){
  it('api::send document', function(done) {
    this.timeout(15000);
    setTimeout(done, 15000);
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
      result.return.resultado.status.should.equal('0');
      done();
    });
  });
});
