import * as React from 'react';
import { ErrorHandling } from './ErrorHandling';
// import { ProjectsPanel } from './ProjectsPanelComponent';
// import { handleOnChange } from './SaveHour';
// import { getSelectedEmployeeData } from './SelectedEmployee';
import { CALC, ERRORS, DATA_WORKSHEET } from './shared/constant';
// import { EmployeeData } from './shared/model/interfaces/EmployeeData';
import { ProjectData } from './shared/model/interfaces/ProjectData';

export default class App extends React.Component<
  {},
  {
    projectsSheet: Excel.Worksheet;
    projects: ProjectData[];
    total: number;
    dataLoaded: boolean;
    employeeName: string;
    employeeCell: string;
    error: {
      showError: boolean;
      errorMessage: string;
      color: string;
    };
    showTable: boolean;
  }
> {
  constructor(props: any, context: Excel.RequestContext) {
    super(props, context);
    // handleOnChange.bind(this);

    this.state = {
      projectsSheet: undefined,
      projects: undefined,
      total: undefined,
      employeeName: undefined,
      employeeCell: undefined,
      dataLoaded: false,
      error: {
        showError: true,
        errorMessage: '',
        color: 'white',
      },
      showTable: true,
    };
  }

  // setError(showError: boolean, errorMessage: string, color: string) {
  //   this.setState({
  //     error: {
  //       showError: showError,
  //       errorMessage: errorMessage,
  //       color: color,
  //     },
  //   });
  // }
  // setDataLoaded(loadData: boolean) {
  //   this.setState({
  //     dataLoaded: loadData,
  //   });
  // }
  // setShowTable(showTable: boolean) {
  //   this.setState({
  //     showTable: showTable,
  //   });
  // }

  // // Called once the page is loaded and the components are ready
  // componentDidMount() {
  //   Office.onReady(() => {
  //     this.clickListener();
  //     this.onChangeListener();
  //     this.onCalculatedListener();
  //     this.click();
  //   });
  // }

  // // Called every time the user click on a cell
  // clickListener = async () => {
  //   await Excel.run(async (context) => {
  //     const activeSheet = context.workbook.worksheets.getActiveWorksheet();
  //     activeSheet.onSelectionChanged.add(this.click); // Check if the selected cell has changed
  //     await context.sync();
  //   });
  // };
  // // Called every time the user change a value in a cell
  // onChangeListener = async () => {
  //   await Excel.run(async (context) => {
  //     const activeSheet = context.workbook.worksheets.getActiveWorksheet();
  //     activeSheet.onChanged.add(this.click); // Check if the selected cell data has changed
  //     await context.sync();
  //   });
  // };
  // // Called every time the ADC.DYNACOLUMNS function calculate
  // onCalculatedListener = async () => {
  //   await Excel.run(async (context) => {
  //     const activeSheet = context.workbook.worksheets.getActiveWorksheet();
  //     activeSheet.onCalculated.add(this.onCalculatedHandler);
  //     await context.sync();
  //   });
  // };

  // updateTotal = (newTotal) => {
  //   this.setState({ total: newTotal });
  // };

  // onCalculatedHandler = async () => {
  //   Excel.run(async (context) => {
  //     setTimeout(async () => {
  //       const activeSheet = context.workbook.worksheets.getActiveWorksheet(); //Get the active Excel sheet
  //       const range = activeSheet.context.workbook
  //         .getSelectedRange()
  //         .load(['values']); // Get the selected cell location, value and index of its row
  //       await context.sync();
  //       if (range.values[0][0] !== CALC) {
  //         this.updateTotal(range.values[0][0]);
  //       }
  //     }, 80);
  //   });
  // };

  // // Get projects' data of the selected Employee
  // click = async () => {
  //   try {
  //     return Excel.run(async (context) => {
  //       const employeeData: EmployeeData = {
  //         activeEmployee: undefined,
  //         data: {
  //           employeeCell: undefined,
  //           dataSheet: undefined,
  //           value: undefined,
  //         },
  //       };

  //       await getSelectedEmployeeData(
  //         context,
  //         this.updateTotal,
  //         this.setError.bind(this),
  //         this.setDataLoaded.bind(this),
  //         this.setShowTable.bind(this),
  //       ).then((res: any) => {
  //         employeeData.activeEmployee = res.activeEmployee.values[0][0];
  //         employeeData.data = res.data;
  //       });

  //       const projectsCol = context.workbook.worksheets
  //         .getItem(employeeData.data.dataSheet)
  //         .tables.getItemAt(0)
  //         .columns.load('items');

  //       await context.sync();
  //       let projectsValue = projectsCol.items[0].values.slice(
  //         1,
  //         projectsCol.items[0].values.length,
  //       );

  //       if (projectsValue.length < employeeData.data.value.length) {
  //         this.setError(true, ERRORS.MORE_VALUES, 'yellow');
  //         this.setDataLoaded(false);
  //       } else if (projectsValue.length > employeeData.data.value.length) {
  //         const diference =
  //           projectsValue.length - employeeData.data.value.length;
  //         for (let i = 0; i < diference; i++) {
  //           employeeData.data.value.push('0');
  //         }
  //       }

  //       if (projectsValue.length >= employeeData.data.value.length) {
  //         this.setError(false, '', 'white');
  //         this.setDataLoaded(false);
  //       }

  //       const proj: ProjectData[] = projectsValue.map(
  //         (project: string[], idx: number) => {
  //           return {
  //             name: project[0],
  //             value: employeeData.data.value[idx],
  //           };
  //         },
  //       );

  //       this.setState({
  //         projects: proj, // Set the state projects with the projects from the sheet with their data
  //         employeeName: employeeData.activeEmployee, // Set the state name with the selected Employee
  //         employeeCell: employeeData.data.employeeCell, // Set the state name with the selected Employee
  //         dataLoaded: true, // Set the state dataLoaded to true once the data is ready to be displayed
  //       });
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  componentDidMount() {
    const formula = '=ADC.DYNACOLUMNS(A2,"",{1;5})';
    let parsedFormula = formula.split('(')[1].split(',');
    parsedFormula[2] = parsedFormula[2].substring(
      1,
      parsedFormula[2].length - 2,
    );
    const cell = parsedFormula[0];
    const column = parsedFormula[1];
    const values = parsedFormula[2].split(';');
    console.log('formula', cell, column, values);
    // Excel.run(async (context) => {

    //   // console.log('this is Activities:', dataDefinitions);
    // });
  }

  render() {
    return (
      <div className="ms-welcome">
        <ErrorHandling error={this.state.error}>
          {/* {this.state.dataLoaded && this.state.showTable && (
            <ProjectsPanel
              state={this.state}
              setError={this.setError.bind(this)}
              setDataLoaded={this.setDataLoaded.bind(this)}
            />
          )} */}
        </ErrorHandling>
      </div>
    );
  }
}