import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import './RamaisBel.css'


interface Ramal {
  nome: string;
  filas: string;
  ramal: number;
  status: string;
}

export default function RamaisBel() {

  const [ramaisFiltered, setRamalFiltered] = React.useState<Ramal[]>([]);
  const [ramaisBkp, setRamaisBkp] = React.useState<Ramal[]>([]);
  let ramais: Ramal[] = [];



  function filterFila(fila: string) {
    if (!fila)
      return '--';
    let f: string[] = fila.split(",");
    if (f.length == 1)
      return f[0].indexOf('(') > -1 && ('(') && f[0].indexOf(')') > -1 ? f[0].substring(f[0].indexOf("(") + 1, f[0].indexOf(")")) : f[0];
    else {
      let res: string[] = f.map(fil => (fil.indexOf('(') > -1 && ('(') && fil.indexOf(')') > -1 ? fil.substring(fil.indexOf("(") + 1, fil.indexOf(")")) : fil))
      return res.join(", ");
    }
  }

  function getClassStatus(status: string) {
    if (!status)
      return "";
    switch (status) {
      case "Livre":
        return "free"
      case "Indisponível":
        return "not-allowed"
      case "Em ligação":
        return "not-free";
      case "Tocando":
        return "receiving-call";
    }
  }
  function getIconStatus(status: string) {
    if (!status)
      return "Phone";
    switch (status) {
      case "Livre":
        return "DeclineCall"
      case "Indisponível":
        return "Blocked"
      case "Em ligação":
        return "Speech";
      case "Tocando":
        return "IncomingCall";
      default:
        return "Phone";
    }
  }


  function filter(e?: any) {
    let srch: string = !!e ? e.target.value : (document.getElementById("iptFilter") as HTMLInputElement).value;

    let ram: Ramal[] = []
    if (!!e)
      ram = ramaisBkp;
    else
      ram = ramais;


    if (!!srch)
      ram = ram.filter(ra =>
        ra.nome.toUpperCase().indexOf(srch.toUpperCase()) > -1
        || ra.ramal.toString().toUpperCase().indexOf(srch.toUpperCase()) > -1
        || (!!ra.status && ra.status.toUpperCase().indexOf(srch.toUpperCase()) > -1)
        || (!!ra.filas && ra.filas.toUpperCase().indexOf(srch.toUpperCase()) > -1)
      );
    setRamalFiltered(ram);

  }


  async function getRamais() {
    let data: Ramal[] = await fetch(
      `https://SUA_API_RAMAIS`,
      {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa("USER_API:PASSWORD_API"),
        }

      }).then(res => res.json())


     
    // data = data.filter((r) => r.ramal != 1234);
    ramais = data;
    setRamaisBkp(data);
    if (ramais.length > 0)
      filter()

  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      getRamais();
    }
      , 600);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className='container'>
      <p className="titlePage"><Icon iconName="Phone" /> Ramais Bel</p>
      <br/>
      <div className='containerFilter'>
        <input id="iptFilter" type="text" className='cutom-input' placeholder='Digite para filtrar' onKeyUp={(e) => filter(e)} />
        <span>Exibindo {ramaisFiltered.length} de {ramaisBkp.length} resultados.</span>
      </div>
      <div className='scrollable-div'>

        <table className='table-share'>

          <thead>
            <tr>
              <th><Icon iconName="NumberSymbol" />  N° Ramal</th>
              <th><Icon iconName="Contact" /> Usuário</th>
              <th><Icon iconName="WorkforceManagement" /> Fila</th>
              <th><Icon iconName="TransferCall" />  Status</th>
            </tr>
          </thead>
          <tbody id="ramais">
            {ramaisFiltered.map((r, index) =>
              <tr>
                <td>{r.ramal}</td>
                <td>{r.nome}</td>
                <td>{filterFila(r.filas)}</td>
                <td >
                  {r.status} <Icon className={getClassStatus(r.status)} iconName={getIconStatus(r.status)} />
                </td>
              </tr>
            )
            }


            {(((!ramaisFiltered || ramaisFiltered.length == 0)) && (
              <tr>
                <td colSpan={4} className='result-none'>
                  <Icon iconName='Search' /> 0 Resultados Encontrados
                </td>
              </tr>
            ))}

          </tbody>
        </table >
      </div>
    </div>
  )

}