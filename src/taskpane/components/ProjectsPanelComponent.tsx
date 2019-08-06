import * as React from 'react';
import { save } from './SaveHour';
import { TOTAL } from './shared/constant';
import { ERRORS } from './shared/constant';
import { ProjectData } from './shared/model/interfaces/ProjectData';

export const ProjectsPanel: React.FC<{
  employee: {
    name: string;
    worksheetData: ProjectData[];
    total: number;
  };
  setError: Function;
  setDataLoaded: Function;
}> = (props) => {
  const handleOnChange = async (
    event: any,
    index: number,
    state: any,
    setError: Function,
    setDataLoaded: Function,
  ) => {
    const projects = document.getElementsByClassName('projectFTE');
    const projs = new Array();
    const reg = new RegExp('[A-Za-z]', 'gmi');
    let error = false;
    for (let i = 0; i < projects.length; i++) {
      projs.push(projects[i]);
    }
    for (let i = 0; i < projs.length; i++) {
      if (reg.test(projs[i].value) || projs[i].value === '') {
        setError(true, ERRORS.VALUE, 'red');
        setDataLoaded(true);
        error = true;
      }
    }

    if (isNaN(event.currentTarget.value) || event.currentTarget.value === '') {
      props.employee.worksheetData[event.currentTarget.id].error = true;
      error = true;
      setError(true, ERRORS.VALUE, 'red');
      setDataLoaded(true);
    } else if (!isNaN(event.currentTarget.value) && !error) {
      props.employee.worksheetData[event.currentTarget.id].error = false;
      setError(false, '', 'white');
      setDataLoaded(true);
    } else if (
      !isNaN(event.currentTarget.value) &&
      !reg.test(event.currentTarget.value)
    ) {
      props.employee.worksheetData[event.currentTarget.id].error = false;
    }

    if (
      !isNaN(event.currentTarget.value) &&
      event.keyCode === 13 &&
      !state.error.showError
    ) {
      for (let i = 0; i < projs.length; i++) {
        state.projects[i].value = projs[i].value;
      }
      setError(false, '', 'white');
      setDataLoaded(true);
      save(index, state.projects, state.employeeCell); // Calls the function to save the new value in the Excel file
    }
  };

  return (
    <table className="projectGride">
      <thead className="employeeName">
        <tr>
          <th colSpan={2}>{props.employee.name}</th>
        </tr>
      </thead>
      <tbody className="projectsContainer">
        {props.employee.worksheetData.map((definition: any, i: number) => {
          return (
            <tr className="project" key={i}>
              <td className="projectName">{definition.name}</td>
              <td>
                <input
                  id={i.toString()}
                  key={definition}
                  className={
                    definition.error ? 'projectFTE error-value' : 'projectFTE'
                  }
                  defaultValue={definition.value}
                  onKeyUp={(event) =>
                    handleOnChange(
                      event,
                      i,
                      props.employee,
                      props.setError,
                      props.setDataLoaded,
                    )
                  }
                />
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot className="total">
        <tr>
          <td>{TOTAL}</td>
          <td>{props.employee.total}</td>
        </tr>
      </tfoot>
    </table>
  );
};
