import { debounce } from 'lodash';
 
//  Save the new hour data in the Excel file
const save = debounce(async (index: number, projects: any) => {
    try {
      await Excel.run(async context => {
        const activeSheet = context.workbook.worksheets.getFirst(); // Get the Excel sheet to update
        const cellToUpdate = activeSheet.context.workbook.getSelectedRange().load(["address", "values", "rowIndex", "formulas"]);
        await context.sync();
        const data = cellToUpdate.formulas[0][0]
        .split('(')[1]
        .split(',');
        data[1] = data[1].split('[')[1];
        data[data.length - 1] = data[data.length - 1].split(']')[0];
        data[index + 1] = projects[index].hours;
        const formula ='render(' + data[0] + ',[' + data.slice(1, data.length).map((hour: any) => {return(hour)}) + '])';
        cellToUpdate.formulas = [[formula]];
      })
    } catch (error) {
      console.error(error);
    }
  }, 200); // Wait 0.2 seconds when the function is called before to do it

  // Check the value typed by the user in Hours fields 
  // Called when the user start typing in Hours fields
  const handleHourChange = async (e: any, index: number, state: any) => {
    const newValue = Number.parseInt(e.currentTarget.textContent); // Set the value to number, will be NaN if the value is composed of characters which are not numbers 
    
    if (!isNaN(newValue)) {  // Check if the typed value is a number or NaN
      state.projects[index].hours = newValue.toString(); // Change the hour value with the new value in the state hoursList
      save(index, state.projects); // Calls the function to save the new value in the Excel file
    }
  }

export { handleHourChange };