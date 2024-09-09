import React ,{ useState, MouseEvent,useEffect } from "react"
import { Box, Button, ButtonGroup, Card, CardContent, CardHeader, Container, Divider } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { Pen, PencilIcon } from "lucide-react"
import EditIcon from '@mui/icons-material/Edit';

import { Calendar, type Event, dateFnsLocalizer } from "react-big-calendar"

import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import es from "date-fns/locale/es"

import "react-big-calendar/lib/css/react-big-calendar.css"

import EventInfo from "./EventInfo.tsx"
import AddEventModal from "./AddEventModal.tsx"
import EventInfoModal from "./EventInfoModal.tsx"
import { AddTodoModal } from "./AddTodoModal.tsx"
import AddDatePickerEventModal from "./AddDatePickerEventModal.tsx"

const locales = { 'es': es || undefined };
const cultures = [ 'es']
const lang = {
  'es': {
    week: 'Semana',
    work_week: 'Semana de trabajo',
    day: 'Día',
    month: 'Mes',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    agenda: 'Diario',

    showMore: (total) => `+${total} más`,
  },
  
}
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: date => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
})

export interface ITodo {
  _id: string
  title: string
  color?: string
}

export interface IEventInfo extends Event {
  _id: string
  description: string
  todoId?: string
}

export interface EventFormData {
  description: string
  todoId?: string
}

export interface DatePickerEventFormData {
  description: string
  todoId?: string
  allDay: boolean
  start?: Date
  end?: Date
}

export const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString()

const initialEventFormState: EventFormData = {
  description: "",
  todoId: undefined,
}

const initialDatePickerEventFormData: DatePickerEventFormData = {
  description: "",
  todoId: undefined,
  allDay: false,
  start: undefined,
  end: undefined,
}


const EventCalendar = () => {
  const [openSlot, setOpenSlot] = useState(false)
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const [openTodoModal, setOpenTodoModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null)

  const [eventInfoModal, setEventInfoModal] = useState(false)

  const [events, setEvents] = useState<IEventInfo[]>([])
  const [todos, setTodos] = useState<ITodo[]>([])
  
  const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState)

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

    useEffect(() => {
      // Función para cargar los datos de eventos desde el backend
      const fetchEventFromBackend = async () => {
        try {
          const response = await fetch('http://localhost:3001/obtener-eventos');
          const data = await response.json();
      
          if (!response.ok) {
            throw new Error(data.error || 'Error al obtener objetivos desde el servidor.');
          }
      
          console.log('Objetivos recibidos desde el servidor:', data);
      
          if (Array.isArray(data.content)) {
            // Convertir valores de start y end a objetos Date
            const formattedEvents = data.content.map(event => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end)
            }));
            setEvents(formattedEvents);
          } else {
            console.error('Los datos recibidos no son un array:', data.content);
          }
        } catch (error) {
          console.error('Error al obtener objetivos desde el servidor:', error);
        }
      };
      
      const fetchCatFromBackend = async () => {
        try {
          const response = await fetch('http://localhost:3001/obtener-categoria');
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.error || 'Error al obtener categoria desde el servidor.');
          }
  
          console.log('Categoria recibida desde el servidor:', data);
  
          if (Array.isArray(data.content)) {
            setTodos(data.content);
          } else {
            console.error('Los datos recibidos no son un array:', data.content);
          }
        } catch (error) {
          console.error('Error al obtener objetivos desde el servidor:', error);
        }
      };

  
      fetchCatFromBackend();
      fetchEventFromBackend();
    }, []);
  
  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true)
    setCurrentEvent(event)
  }
  const handleCloseTodoModal = (todos) => {
    setOpenTodoModal(false);
    // Guardar la nueva categoría en el backend
    addCategoria(todos);
  };

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setEventInfoModal(true)
  }

  const handleClose = () => {
    setEventFormData(initialEventFormState)
    setOpenSlot(false)
  }

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData)
    setOpenDatepickerModal(false)
  }

  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data: IEventInfo = {
      ...eventFormData,
      _id: generateId(),
      start: currentEvent?.start,
      end: currentEvent?.end,
    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    console.log('NewEvents',newEvents)
    addObjective(newEvents)
    handleClose()
  }
  const fetchEventFromBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/obtener-eventos');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener objetivos desde el servidor.');
      }

      console.log('Objetivos recibidos desde el servidor:', data);

      if (Array.isArray(data.content)) {
        
      } else {
        console.error('Los datos recibidos no son un array:', data.content);
      }
    } catch (error) {
      console.error('Error al obtener objetivos desde el servidor:', error);
    }
  };

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined
    }

    const setMinToZero = (date: any) => {
      date.setSeconds(0)
      console.log('fecha:',date)
      return date
    
    }

    const data: IEventInfo = {
      ...datePickerEventFormData,
      _id: generateId(),
      start: setMinToZero(datePickerEventFormData.start),
      end: datePickerEventFormData.allDay
        ? addHours(datePickerEventFormData.start, 12)
        : setMinToZero(datePickerEventFormData.end),
    }

    const newEvents = [...events, data]

    setEvents(newEvents)
    addObjective(newEvents)
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

  const onDeleteEvent = async() => {

    const eventId = (currentEvent as IEventInfo)._id;
    console.log(eventId)
    await delteEvento(eventId)
    setEvents(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
    
    setEventInfoModal(false)

  }
  const delteEvento = async (_id)=>{
    try {
      const response = await fetch(`http://localhost:3001/borrar-evento/${_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al borrar la tarea en el servidor.');
      }

      console.log('Tarea borrada correctamente en el servidor.');
    } catch (error) {
      console.error('Error al borrar la tarea en el backend:', error);
    }
  };
  const addObjective = async (newObjective) => {
    try {
      const response = await fetch('http://localhost:3001/guardar-evento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newObjective),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el objetivo en el servidor.');
      }

      console.log('Objetivo guardado correctamente en el servidor.');
    } catch (error) {
      console.error('Error al enviar el objetivo al backend:', error);
    }
  };
  const addCategoria = async (todos) => {
    try {
      const response = await fetch('http://localhost:3001/guardar-categoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todos),
      });

      if (!response.ok) {
        throw new Error('Error al guardar categoria en el servidor.');
      }

      console.log('Objetivo guardado correctamente en el servidor.');
    } catch (error) {
      console.error('Error al enviar categoria al backend:', error);
    }
  };

  return (
    <div className="flex justify-center items-center w-full px-7">
     
        <div className="backdrop-blur-lg w-full flex flex-col justify-center">
          <h1 className="text-white text-6xl text-center">Calendario de Objetivos</h1>
            <div className="flex flex-row justify-center my-4">
              <div className="flex flex-row gap-4">
                
                <button className=" inline-block text-white font-bold py-2 px-6 rounded-full bg-transparent border border-transparent transform hover:scale-110 hover:border-white transition-transform duration-3000 ease-in-out" onClick={() => setOpenDatepickerModal(true)}  >
                <span> <AddIcon/> Nuevo Evento</span>
                </button>
                <button onClick={() => setOpenTodoModal(true)}  className="inline-block text-white font-bold py-2 px-6 rounded-full bg-transparent border border-transparent transform hover:scale-110 hover:border-white transition-transform duration-3000 ease-in-out">
                  <span>  Editar Categorias <EditIcon/></span>
                </button>
              </div>
            </div>
           
            <AddEventModal
              open={openSlot}
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent as IEventInfo}
            />
            <AddTodoModal
              open={openTodoModal}
              handleClose={() => handleCloseTodoModal(todos)}
              todos={todos}
              setTodos={setTodos}
            />
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              culture='es'
              startAccessor="start"
              components={{ event: EventInfo }}
              endAccessor="end"
              defaultView="month"
              messages = {lang['es']}
              eventPropGetter={(event) => {
                const hasTodo = todos.find((todo) => todo._id === event.todoId)
                return {
                  style: {
                    backgroundColor: hasTodo ? hasTodo.color : "#ec4899",
                    borderColor: hasTodo ? hasTodo.color : "#910037",
                    borderWidth: "4px",
                    borderRadius:"2px",
                  },
                }
              }}
              style={{
                height: 600,
                backgroundColor:"#FF8CBE",  
                border:"0px",
                borderRadius:"15px",
                color:"white",
                fontWeight:"bold",

              }}
            />
        </div>
    </div>
  )
}

export default EventCalendar
