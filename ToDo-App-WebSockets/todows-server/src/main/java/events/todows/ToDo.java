package events.todows;

/**
 * This class represents a ToDo task, consisting in:
 * 		- Task description
 * 		- Task context
 * 		- Task project
 * 		- Task priority
 * 
 * @author Daniel
 *
 */
public class ToDo {
	
	private String task;		//Task description
	private String context;	//Task context
	private String project;	//Task project
	private int priority;	//Task priority
	private int id;
	
	public ToDo(){
	}
	
	//CONSTRUCTOR
	public ToDo(String task,String ctx,String proj,int pri){
		this.task = task;
		this.context = ctx;
		this.project = proj;
		this.priority = pri;
	}

	//SETTERS & GETTERS
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getTask() {
		return task;
	}

	public void setTask(String task) {
		this.task = task;
	}

	public String getContext() {
		return context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public int getPriority() {
		return priority;
	}

	public void setPriority(int priority) {
		this.priority = priority;
	}
}