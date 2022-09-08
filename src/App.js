import React, { useEffect, useState } from "react";
import { DataGrid, esES } from "@mui/x-data-grid";
import { Input } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./App.css";


function App() {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: "200",
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: "incidente",
      headerName: "INCIDENTE",
      width: "1000",
      headerAlign: 'center',
      align: 'left',
    },
  ];

  const [issues, setIssues] = useState([])
  const [text, setText] = useState([]);
  const [invalid, setInvalid] = useState(true);
  const [inputValue, setInputValue] = useState();
  let fileReader;

  const onChange = (e) => {
    let file = e.target.files;
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file[0]);
  };

  const FiltrarIncidentes = () => {
    const regex = new RegExp(
      `((\\W*(()${inputValue}())\\W*)(\\-|/)(3[01]|[12][0-9]|0?[1-9])(;)[A-Z]{3}(-)(\\d{2})[A-Z]{1}).+`
    );

    // eslint-disable-next-line array-callback-return
    const dataFiltered = text.filter((x) => {
      if (regex.test(x?.incidente)) return x;
    });

    if (dataFiltered.length > 0) setText(dataFiltered);
  };

  const validateInput = (e) => {
    setInputValue(e?.target?.value);
    let pattern =
      /(([1][9][0-9][0-9])|(20[0-1][0-9]|20[2][0-2]))(-|\/)(0[1-9]|10|11|12)/;
    setInvalid(!pattern.test(e?.target?.value));
  };

  const handleFileRead = (e) => {
    let content = fileReader.result;
    const string = content.replace(/^\s*[\r\n]/gm, "");
    let array = string.split(new RegExp(/[\r\n]/gm));
    // eslint-disable-next-line array-callback-return
    const linesGood = array?.map((x, i) => {
      let text = x;
      let pattern =
        /((([1][9][0-9][0-9])|(20[0-1][0-9]|20[2][0-2]))(-|\/)(0[1-9]|10|11|12)(-|\/)(3[01]|[12][0-9]|0?[1-9])(;)[A-Z]{3}(-)(\d{2})[A-Z]{1}).+/;
      if (pattern.test(text)) return { id: i, incidente: x };
    });
    setIssues(linesGood?.filter((x) => x !== undefined));
    setText(linesGood?.filter((x) => x !== undefined));
  };

  useEffect(() => {
    if(!inputValue?.length) setText(issues)
  }, [inputValue, issues])

  return (
    <div>
      <div style={{ marginTop: '2%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h2>FILTRO DE INCIDENCIAS QUE INVOLUCRAN MOTOCICLETAS</h2>
        <img src={require('../src/assets/logo.png')} alt='' width='15%' height='15%' />
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <div style={{ marginTop: '2%', width: '93%', padding: '15px', display: 'flex', justifyContent: 'space-evenly', alignContent: 'center', backgroundColor: '#fff' }}>
          <Input type="file" name="myfile" style={{ width: '30%' }} onChange={onChange} accept=".txt" />
          <TextField
            id="fecha"
            label="YYYY-MM"
            type='search'
            style={{ width: '20%' }}
            onChange={validateInput}
            placeholder='Escriba aquí...'
          />
          <Button
            variant="contained"
            color="success"
            onClick={FiltrarIncidentes}
            disabled={invalid || text?.length === 0}
          >
            Filtrar Incidentes
          </Button>
        </div>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <div style={{ width: '95%', height: 500, justifyContent: 'center', display: 'flex', marginTop: '20px' }}>
          <DataGrid
            rows={text || []}
            columns={columns}
            rowHeight={29}
            pageSize={13}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{ backgroundColor: '#fff' }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
