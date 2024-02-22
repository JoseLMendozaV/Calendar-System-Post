let holidays = {
  "1-09": "Día de los Mártires",
  "3-01": "Carnavales",
  "3-02": "Carnavales",
  "3-03": "Carnavales",
  "3-04": "Carnavales",
  "3-05": "Miércoles de Ceniza",
  "3-19": "Día libre distrital",
  "3-28": "Jueves Santo",
  "3-29": "Viernes Santo",
  "5-01": "Día del Trabajador",
  "8-16": "Aniversario de la UTP",
  "11-02": "Día del los difuntos",
  "11-03": "Fiestas Patrias",
  "11-04": "Fiestas Patrias",
  "11-05": "Fiestas Patrias",
  "11-11": "Fiestas Patrias",
  "11-28": "Fiestas Patrias",
  "12-09": "Día de la Madre",
};

function generateCalendar() {
  const year = parseInt(document.getElementById("yearInput").value, 10);
  const calendarContainer = document.getElementById("calendarContainer");
  calendarContainer.innerHTML = ""; // Limpia el contenedor antes de generar el nuevo calendario
  calendarContainer.className = "row"; // Aplica la clase 'row' de Bootstrap para un diseño responsivo

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  months.forEach((monthName, index) => {
    const daysInMonth = new Date(year, index + 1, 0).getDate();
    const firstDay = new Date(year, index, 1).getDay();

    // Contenedor para cada mes
    const monthDiv = document.createElement("div");
    monthDiv.className = "col-lg-4 col-md-6"; // Clases de Bootstrap para controlar la disposición en diferentes tamaños de pantalla
    monthDiv.innerHTML = `<div class="month p-3 mb-4 bg-light border rounded"><h3 class="text-center">${monthName} ${year}</h3>`;

    // Inicio de la tabla para los días del mes
    let tableHTML =
      '<table class="table table-sm"><thead class="thead-dark"><tr><th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th></tr></thead><tbody><tr>';

    // Llenar los días vacíos antes del inicio del mes
    for (let i = 0; i < firstDay; i++) {
      tableHTML += "<td></td>";
    }

    // Llenar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayKey = `${index + 1}-${day.toString().padStart(2, "0")}`;
      const isHoliday = holidays[dayKey] ? ' class="holiday"' : "";
      tableHTML += `<td id='cell-${year}-${
        index + 1
      }-${day}'${isHoliday}>${day}</td>`;
      if ((day + firstDay) % 7 === 0 && day < daysInMonth) {
        tableHTML += "</tr><tr>"; // Comenzar una nueva fila cada semana
      }
    }

    // Cerrar la tabla y añadir al contenedor del mes
    tableHTML += "</tr></tbody></table></div>";
    monthDiv.innerHTML += tableHTML;
    calendarContainer.appendChild(monthDiv); // Añadir el mes al contenedor principal
  });
}

// Funciones para gestionar feriados
// ...

function addHoliday() {
  const month = document.getElementById("holidayMonth").value.padStart(2, "0");
  const day = document.getElementById("holidayDay").value.padStart(2, "0");
  const name = document.getElementById("holidayName").value;
  const key = `${month}-${day}`;

  holidays[key] = name;

  document.getElementById("holidayMonth").value = "";
  document.getElementById("holidayDay").value = "";
  document.getElementById("holidayName").value = "";

  updateHolidaysList();
  generateCalendar();
}

function deleteHoliday(key) {
  delete holidays[key];
  updateHolidaysList();
  generateCalendar();
}

function updateHolidaysList() {
  const holidaysList = document.getElementById("holidaysList");
  holidaysList.innerHTML = "";

  for (const [key, name] of Object.entries(holidays)) {
    const entry = document.createElement("div");
    entry.textContent = `${key}: ${name} `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = function () {
      deleteHoliday(key);
    };
    //entry.appendChild(deleteButton);
    holidaysList.appendChild(entry);
  }
}

let materias = [];

function obtenerColorFacultad(facultad) {
  const colores = {
    CienciasTecnologia: "orange",
    IngenieriaCivil: "purple",
    IngenieriaElectrica: "lightblue",
    IngenieriaIndustrial: "yellow",
    IngenieriaMecanica: "maroon",
    IngenieriaSistemas: "green",
  };
  return colores[facultad];
}

//Colores bases y variaciones para la maestria y facultades

const coloresFacultades = {
  CienciasTecnologia: {
    base: "#FFA500",
    variaciones: ["#B27B17", "#FFE2AE"],
  },
  IngenieriaCivil: {
    base: "#C100FF",
    variaciones: ["#5A0D72", "#EDB3FF"],
  },
  IngenieriaElectrica: {
    base: "#00FFF7",
    variaciones: ["#186E6B", "#98FFFB"],
  },
  IngenieriaIndustrial: {
    base: "#F7FF00",
    variaciones: ["#7E811B", "#FCFF99"],
  },
  IngenieriaMecanica: {
    base: "#FF0000",
    variaciones: ["#6C2323", "#FFABAB"],
  },
  IngenieriaSistemas: {
    base: "#008000",
    variaciones: ["#00FF00", "#549B54"],
  },
};

function obtenerColorMaestria(facultad, maestriaIndex) {
  // Intenta obtener las variaciones de color para la facultad
  const colores = coloresFacultades[facultad];
  if (!colores) return "#CCCCCC"; // Retorna un color por defecto si la facultad no está definida

  // Si hay variaciones, selecciona una basada en el índice de la maestría
  if (colores.variaciones && colores.variaciones.length > maestriaIndex) {
    return colores.variaciones[maestriaIndex];
  }

  // Si no hay suficientes variaciones, retorna el color base de la facultad
  return colores.base;
}

function existeChoqueHorario(fecha, facultad, maestria) {
  // Verificar choque de horario solo con materias de la misma maestría y facultad
  return materias.some(
    (materia) =>
      materia.facultad === facultad &&
      materia.maestria === maestria && // Asumimos que ahora guardas la maestría de la materia
      materia.clases.some((clase) => clase.getTime() === fecha.getTime())
  );
}

function agregarMateria() {
  const nombreMateria = document.getElementById("nombreMateria").value;
  const facultad = document.getElementById("facultadMateria").value;
  const maestria2 = document.getElementById("maestriaMateria").value; // Asume que se obtiene la maestría seleccionada
  const maestria = document.getElementById("maestriaMateria").selectedIndex; // Usa el índice seleccionado como un simplificado "ID" de la maestría
  //const colorMateria = obtenerColorFacultad(facultad);
  // Obtiene el color de la maestría basado en la facultad y el índice de la maestría
  const colorMateria = obtenerColorMaestria(facultad, maestria);
  const fechaInicio = new Date(
    document.getElementById("fechaInicioMateria").value
  );
  const totalClases = parseInt(
    document.getElementById("totalClases").value,
    10
  );
  const diasSeleccionados = [];
  document
    .querySelectorAll(".management input[type=checkbox]:checked")
    .forEach((checkbox) => {
      diasSeleccionados.push(parseInt(checkbox.value));
    });

  let fechaActual = fechaInicio;
  let contadorClases = 0;
  let fechasClases = [];

  while (contadorClases < totalClases) {
    if (diasSeleccionados.includes(fechaActual.getDay())) {
      const keyFecha = `${fechaActual.getMonth() + 1}-${fechaActual
        .getDate()
        .toString()
        .padStart(2, "0")}`;
      if (
        !holidays[keyFecha] &&
        !existeChoqueHorario(fechaActual, facultad, maestria)
      ) {
        // Añadida la maestría como parámetro
        contadorClases++;
        fechasClases.push(new Date(fechaActual));
      } else if (existeChoqueHorario(fechaActual, facultad, maestria)) {
        // Verificación de choque considerando la maestría
        Swal.fire({
          title: "Choque de horario detectado",
          text: `Con '${nombreMateria}' el ${fechaActual.toLocaleDateString()}`,
          icon: "warning",
          confirmButtonText: "Entendido",
        });
        return; // Detiene la función si hay un choque de horario
      }
    }
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  // Si no hay choques, proceder a agregar la materia
  materias.push({
    nombre: nombreMateria,
    facultad: facultad,
    maestria: maestria, // Asegúrate de incluir la maestría aquí
    maestria2: maestria2,
    clases: fechasClases,
    color: colorMateria,
  });

  // Llamada a SweetAlert2 para confirmar la adición exitosa
  Swal.fire({
    title: "¡Materia Agregada!",
    text: `La materia "${nombreMateria}" ha sido agregada exitosamente a la maestría "${maestria2}".`,
    icon: "success",
    confirmButtonText: "Ok",
  });

  actualizarCalendarioConClases();
  //actualizar lista de materias
  actualizarListaDeMaterias();
  // Cualquier otra lógica necesaria después de agregar la materia
}
// hasta aqui llega la funcion de agregar materia
function showAlert(message) {
  document.querySelector("#alertModal .modal-body").textContent = message;
  $("#alertModal").modal("show");
}

function actualizarCalendarioConClases() {
  // Restablecer el estado de las celdas del calendario antes de actualizar
  document.querySelectorAll('[id^="cell-"]').forEach((cell) => {
    cell.style.backgroundColor = ""; // Restablece el color de fondo
    cell.style.background = ""; // Restablece cualquier gradiente de fondo
    cell.classList.remove("inicio-materia"); // Elimina la clase de inicio de materia
    if (cell._tippy) {
      cell._tippy.destroy(); // Destruye el tooltip si existe
    }
  });

  const infoPorDia = {}; // Información de materias y colores por día

  // Recolectar información de todas las materias por día
  materias.forEach((materia) => {
    materia.clases.forEach((fecha, index) => {
      const cellId = `cell-${fecha.getFullYear()}-${
        fecha.getMonth() + 1
      }-${fecha.getDate()}`;
      if (!infoPorDia[cellId]) {
        infoPorDia[cellId] = {
          colores: new Set(),
          detalles: [],
          inicioMaterias: [],
        };
      }
      infoPorDia[cellId].colores.add(materia.color);
      infoPorDia[cellId].detalles.push(
        `${materia.nombre} (${materia.maestria2})`
      );

      // Si es el primer día de la materia, marcar como inicio
      if (index === 0) {
        // Asumiendo que el primer elemento en 'clases' es el inicio de la materia
        infoPorDia[cellId].inicioMaterias.push(materia.nombre);
      }
    });
  });

  // Aplicar la información recolectada al calendario
  Object.entries(infoPorDia).forEach(
    ([cellId, { colores, detalles, inicioMaterias }]) => {
      const cell = document.getElementById(cellId);
      if (cell) {
        let titulo = detalles.join(", ");
        tippy(cell, {
          content: titulo,
          allowHTML: true,
          theme: "light-border",
          animation: "scale",
        });

        if (colores.size > 1) {
          cell.style.background = `linear-gradient(to right, ${Array.from(
            colores
          ).join(", ")})`;
        } else {
          cell.style.backgroundColor = colores.values().next().value;
        }

        // Si la celda marca el inicio de al menos una materia
        if (inicioMaterias.length > 0) {
          cell.classList.add("inicio-materia");
          // Agrega el título de las materias que inician este día al tooltip
          inicioMaterias.forEach((materia) => {
            cell._tippy.setContent(
              `${titulo}<br>Inicia: ${inicioMaterias.join(", ")}`
            );
          });
        }
      }
    }
  );
}

// maestrías por facultad
const maestriasPorFacultad = {
  CienciasTecnologia: [
    "POSTGRADO Y MAESTRÍA EN DOCENCIA SUPERIOR",
    "Maestría en Física",
  ],
  IngenieriaCivil: ["Maestría en IngenieriaCivil", "Maestría en Geotecnia"],
  IngenieriaElectrica: [
    "Maestría en IngenieriaElectrica",
    "Maestría en Geotecnia",
  ],
  IngenieriaIndustrial: [
    "Maestría en IngenieriaIndustrial",
    "Maestría en Geotecnia",
  ],
  IngenieriaMecanica: [
    "Maestría en IngenieriaMecanica",
    "Maestría en Geotecnia",
  ],
  IngenieriaSistemas: [
    "POSTGRADO/MAESTRÍA EN AUDITORÍA DE SISTEMA Y EVALUACIÓN DE CONTROL INFORMÁTICO",
    "Maestría en Geotecnia",
  ],

  // anexar mas maestrias por facultad
};

function actualizarMaestrias() {
  const facultadSeleccionada = document.getElementById("facultadMateria").value;
  const selectMaestria = document.getElementById("maestriaMateria");
  selectMaestria.innerHTML = ""; // Limpiar opciones existentes

  // Llenar el select de maestrías basado en la facultad seleccionada
  const maestrias = maestriasPorFacultad[facultadSeleccionada] || [];
  maestrias.forEach((maestria) => {
    const option = document.createElement("option");
    option.value = maestria;
    option.textContent = maestria;
    selectMaestria.appendChild(option);
  });
}

function actualizarListaDeMaterias() {
  const materiasListadasTbody = document.querySelector(
    "#materiasListadas tbody"
  );
  materiasListadasTbody.innerHTML = ""; // Limpiar la tabla primero

  materias.forEach((materia, index) => {
    const row = materiasListadasTbody.insertRow();
    const cellNumber = row.insertCell(0);
    cellNumber.textContent = index + 1;

    const cellName = row.insertCell(1);
    cellName.textContent = materia.nombre;

    const cellMaestria = row.insertCell(2);
    cellMaestria.textContent = materia.maestria2;

    const cellActions = row.insertCell(3);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "btn btn-danger btn-sm"; // Añadir clases de Bootstrap para el botón
    deleteButton.onclick = function () {
      eliminarMateria(index);
    };
    cellActions.appendChild(deleteButton);
  });
}

// eliminarMateria
function eliminarMateria(index) {
  materias.splice(index, 1); // Elimina la materia del arreglo
  actualizarCalendarioConClases(); // Actualiza el calendario para reflejar la eliminación
  actualizarListaDeMaterias(); // Actualiza la lista de materias
}
// eliminarMateria

document.addEventListener("DOMContentLoaded", function () {
  updateHolidaysList();
  generateCalendar();
  actualizarMaestrias();
  actualizarListaDeMaterias();
  initializeDragAndDrop();
});

function initializeDragAndDrop() {
  // Permitir que cada celda del calendario sea un lugar donde se pueden soltar elementos
  document.querySelectorAll('[id^="cell-"]').forEach((cell) => {
    cell.addEventListener("dragover", function (e) {
      e.preventDefault(); // Necesario para permitir soltar
    });

    cell.addEventListener("drop", function (e) {
      e.preventDefault();
      const holidayId = e.dataTransfer.getData("text"); // Obtener el ID del feriado arrastrado
      moveHoliday(holidayId, cell.id); // Mover el feriado a la nueva celda
    });
  });

  // Marcar cada feriado como arrastrable y asignarle los manejadores de eventos
  document.querySelectorAll(".holiday").forEach((holidayCell) => {
    holidayCell.setAttribute("draggable", true);

    holidayCell.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text", e.target.id); // Establecer el ID del feriado como el dato a transferir
    });
  });
}

function moveHoliday(holidayId, targetCellId) {
  const dateInfo = targetCellId.split("-"); // ID de la celda objetivo tiene el formato 'cell-yyyy-mm-dd'
  const newDate = `${dateInfo[1]}-${dateInfo[2]}-${dateInfo[3]}`; // Formatear la nueva fecha como 'yyyy-mm-dd'

  // Actualizar la fecha del feriado en el objeto 'holidays'
  const holidayKey = Object.keys(holidays).find(
    (key) => holidays[key] === holidayId.replace("holiday-", "")
  );
  if (holidayKey) {
    delete holidays[holidayKey]; // Eliminar el feriado antiguo
    holidays[newDate] = holidayId.replace("holiday-", ""); // Añadir el feriado con la nueva fecha
  }

  // Regenerar el calendario para reflejar el cambio
  generateCalendar();

  // Opcional: Mostrar mensaje de éxito o actualizar la UI de alguna otra manera
  console.log(`Feriado movido a ${newDate}`);
}
