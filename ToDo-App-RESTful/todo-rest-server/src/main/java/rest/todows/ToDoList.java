package rest.todows;

/**
 * This class represents a list of ToDo tasks
 * 
 * @author Daniel
 */
import java.util.ArrayList;
import java.util.List;

public class ToDoList {

	private int nextId = 1;
	private List<ToDo> toDoList = new ArrayList<ToDo>();

//	public ToDoList(){
//		this.toDoList = new ArrayList<ToDo>();
//	}
	
	/**
	 * The value of next unique identifier.
	 * @return the next unique identifier.
	 */
	public int getNextId() {
		return nextId;
	}

	public void setNextId(int nextId) {
		this.nextId = nextId;
	}
	
	/**
	 * Returns the old next identifier and increases the new value in one.
	 * @return an identifier.
	 */
	public int nextId() {
		int oldValue = nextId;
		nextId++;
		return oldValue;
	}
	
	/**
	 * The list of ToDo's in this ToDo's repository.
	 * @return a person list.
	 */
	public List<ToDo> getToDoList() {
		return toDoList;
	}

	public void setToDoList(List<ToDo> toDos) {
		this.toDoList = toDos;
	}
}
