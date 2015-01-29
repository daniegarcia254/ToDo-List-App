package events.todows;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Logger;

import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

@ServerEndpoint(value = "/todos")
public class WordgameServerEndpoint {

	private Logger logger = Logger.getLogger(this.getClass().getName());
	private String fileName = "ToDosJson.txt";
	private String backupFileName = "ToDosJsonBackup.txt";
	private ToDoList todoList = new ToDoList();

	 /**
     * @throws IOException 
	 * @OnOpen allows us to intercept the creation of a new session.
     * The session class allows us to send data to the user.
     * In the method onOpen, we'll let the user know that the handshake was 
     * successful.
     */
	@OnOpen
	public void onOpen(Session session) throws IOException {
		loadFile(false);
		logger.info((session.getId() + " has opened a connection")); 
        try {
            session.getBasicRemote().sendText("Connection Established (session "+ session.getId()+")");
            
        } catch (IOException ex) {
            ex.printStackTrace();
        }
	}

	@OnMessage
	public String onMessage(String message, Session session) throws IOException {
		Gson gson = new Gson();
		switch (message.substring(0,message.indexOf(":"))) {
			case "getTodoList":
				return ("toDoList: "+gson.toJson(todoList.getToDoList()));
			case "addTodo":
				return addToDo(message);
			case "queryToDos":
				return queryToDo(message);
			case "removeOneToDo":
				return removeToDo(message);
			case "removeQueryToDos": 
				return removeToDos(message);
			case "removeAllToDos":
				removeAllToDos();
				return ("toDoList: []");
			case "loadFile":
				return("toDoList: "+gson.toJson(loadFile(false).getToDoList()));
			case "resetToDoFile":
				return resetFile();
			case "quit":
				try {
					session.close(new CloseReason(CloseCodes.NORMAL_CLOSURE,
							"Session Ended"));
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
				break;
		}
		return message;
	}

	/**
     * The user closes the connection.
     */
	@OnClose
	public void onClose(Session session, CloseReason closeReason) {
		logger.info(String.format("Session %s closed because of %s",
				session.getId(), closeReason));
	}
	
	
	/**
	 * Add a ToDo to the ToDo List. Returns the updated ToDo list.
	 * 
	 * @param msg
	 * @return
	 * @throws IOException 
	 */
	private String addToDo(String msg) throws IOException{
		Gson gson = new Gson();
		
		//Lee el fichero repositorio
		todoList = loadFile(false);
		
		//Crea el objeto ToDo a añadir
		ToDo todo = gson.fromJson(msg.substring(msg.indexOf("{"),msg.length()), ToDo.class);
		todo.setId(todoList.nextId());
		todoList.getToDoList().add(todo);
		
		//Añade el nuevo ToDo al fichero repositorio
		writeFile();
		
		//Devuelve en formato string el JSON con los ToDos
		return("toDoList: "+gson.toJson(todoList.getToDoList()));
	}
	
	
	/**
	 * 
	 * Given a string, extract from it the field of a ToDo to search by and
	 * the query to search by.
	 * 
	 * Make the search and return the result of the search.
	 * 
	 * @param msg
	 * @return
	 */
	private String queryToDo(String msg) {
		Gson gson = new Gson();
		String[] parts = msg.split(":");
		ToDoList result = new ToDoList();
		if (!(todoList.getToDoList().isEmpty())){
			for (ToDo todo : todoList.getToDoList()){
				switch (parts[1].trim()){
					case "description":
						if (todo.getTask().contains(parts[2])){
							result.getToDoList().add(todo);
						}
						break;
					case "context":
						if (todo.getContext().contains(parts[2])){
							result.getToDoList().add(todo);
						}
						break;
					case "project":
						if (todo.getProject().contains(parts[2])){
							result.getToDoList().add(todo);
						}
						break;
					default:
						if (todo.getPriority() == Integer.parseInt(parts[2])){
							result.getToDoList().add(todo);
						}
				}
			}
		}
		return("toDoList: "+gson.toJson(result.getToDoList()));
	}
	
	

	
	private String removeToDo(String msg) throws IOException{
		Gson gson = new Gson();
		String[] parts = msg.split(":");
		ToDoList result = new ToDoList();
		if (!(todoList.getToDoList().isEmpty())){
			for (ToDo todo : todoList.getToDoList()){
				if (!(todo.getId() == Integer.parseInt(parts[1]))){
					result.getToDoList().add(todo);
				}
			}
			todoList = result;
			writeFile();
			return ("toDoList: "+gson.toJson(todoList.getToDoList()));
		}
		return ("toDoList: "+gson.toJson(todoList.getToDoList()));
	}
	
	
	private String removeToDos(String msg) throws IOException{
		Gson gson = new Gson();
		String[] parts = msg.split(":");
		logger.info("--"+parts[1]+"--");
		logger.info("--"+parts[2]+"--");
		ToDoList result = new ToDoList();
		if (!(todoList.getToDoList().isEmpty())){
			for (ToDo todo : todoList.getToDoList()){
				switch (parts[1].trim()){
					case "description":
						if (!(todo.getTask().contains(parts[2]))){
							result.getToDoList().add(todo);
						}
						break;
					case "context":
						if (!(todo.getContext().contains(parts[2]))){
							result.getToDoList().add(todo);
						}
						break;
					case "project":
						if (!(todo.getProject().contains(parts[2]))){
							result.getToDoList().add(todo);
						}
						break;
					default:
						if (!(todo.getPriority() == Integer.parseInt(parts[2]))){
							result.getToDoList().add(todo);
						}
				}
			}
			todoList = result;
			writeFile();
		}
		return("toDoList: "+gson.toJson(todoList.getToDoList()));
	}
	
	
	
	/**
	 * Vacía el fichero repositorio y la lista de ToDos
	 * 
	 * @throws IOException
	 */
	private void removeAllToDos() throws IOException{
		
		todoList.setNextId(1);
		todoList.getToDoList().clear();
		
		BufferedWriter bfr = new BufferedWriter(new FileWriter(fileName));
		bfr.write("[]");
		bfr.close();
	}
	
	
	/**
	 * Writes the ToDo list (JSON format) in the repository file & in the BackupFile
	 * 
	 * @throws IOException
	 */
	private void writeFile() throws IOException{
		Gson gson = new Gson();
	    BufferedWriter bfr = new BufferedWriter(new FileWriter(fileName));
	    BufferedWriter bfrBackup = new BufferedWriter(new FileWriter(backupFileName));
	    String list = gson.toJson(todoList.getToDoList());
	    bfr.write(list);
	    bfrBackup.write(list);
	    bfr.close();
	    bfrBackup.close();
	}
	
	
	/**
	 * 
	 * Extract a ToDo List from a file
	 * 
	 * @return
	 * @throws IOException
	 */
	private ToDoList loadFile(boolean reset) throws IOException{
		Gson gson = new Gson();
		BufferedReader bfr =  null;
	    if (reset){
	    	bfr = new BufferedReader(new FileReader(backupFileName));
	    } else {
	    	bfr = new BufferedReader(new FileReader(fileName));
	    }
	    
	    //JSON todos in one line string
	    String jsonLine = bfr.readLine();
	    
	    //Get the ToDo's from the string
	    ToDo[] todos = gson.fromJson(jsonLine, ToDo[].class);
	    
	    //Add the ToDo's to a ToDo List
	    todoList.getToDoList().clear();
	    todoList.setNextId(1);
	    for (int i=0; i<todos.length; i++){
	    	todos[i].setId(todoList.nextId());
	    	todoList.getToDoList().add(todos[i]);
	    }
	    
	    bfr.close();
	    return todoList;
	}
	
	/**
	 * Resets the repository file with the ToDo list stored in the backup file
	 * 
	 * @return
	 * @throws IOException
	 */
	private String resetFile() throws IOException{
		Gson gson = new Gson();
		String response = "toDoList: "+gson.toJson(loadFile(true).getToDoList());
		writeFile();
		return response;
	}
}
