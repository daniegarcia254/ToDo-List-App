package rest.todows;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.Response.Status;

/**
 * A service that manipulates ToDo's in an repository.
 *
 */
@Path("/todolist")
public class ToDoWebService {
	
	/**
	 * The (shared) repository object. 
	 */
	@Inject
	ToDoList toDoList;
	
	/**
	 * A GET /todolist request should return the ToDo's repository in JSON.
	 * @return a JSON representation of the ToDo's repository.
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public ToDoList getToDoList() {
		return toDoList;
	}
	
	/**
	 * A POST /todolist request should add a new entry to the ToDo's repository.
	 * @param info the URI information of the request
	 * @param ToDo the posted entity
	 * @return a JSON representation of the new entry that should be available at /todos/todo/{id}.
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addToDo(@Context UriInfo info, ToDo todo) {
		toDoList.getToDoList().add(todo);
		todo.setId(toDoList.nextId());
		todo.setHref(info.getAbsolutePathBuilder().path("todo/{id}").build(todo.getId()));
		return Response.created(todo.getHref()).entity(todo).build();
	}
	
	/**
	 * A GET /todolist/list/{selector}/{query}/ request should 
	 * return the ToDo's in the repository whose field {selector} contains {query}
	 * @param selector the ToDo field to search for a match
	 * @param query the text to match
	 * @return 200 if the request is successful, 404 if if the search has no matches
	 */
	@GET
	@Path("list/{selector}/{query}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listToDos(@PathParam("selector") String selector,
								@PathParam("query") String query) {
		
		ToDoList result = new ToDoList();
		int found = 0;
		
		if (selector.compareTo("description")==0){
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getTask().contains(query)) {
					result.getToDoList().add(todo);
					found++;
				}
			}
		} else if (selector.compareTo("context")==0){
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getContext().contains(query)) {
					result.getToDoList().add(todo);
					found++;
				}
			}
		} else if (selector.compareTo("project")==0){
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getProject().contains(query)) {
					result.getToDoList().add(todo);
					found++;
				}
			}
		}else {
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getPriority() == Integer.parseInt(query)) {
					result.getToDoList().add(todo);
					found++;
				}
			}
		}
		if (found>0) {
			return Response.ok(result).build();
		} else {
			return Response.status(Status.NOT_FOUND).build();

		}
	}
	
	/**
	 * A DELETE /todolist/remove/{selector}/{query}/ request should return the ToDo's in the repository 
	 * whose field {selector} contains {query} and delete them from the repository
	 * @param selector the ToDo field to search for a match
	 * @param query the text to match
	 * @return 200 if the request is successful, 404 if the search has no matches
	 */
	@DELETE
	@Path("remove/{selector}/{query}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeToDos(@PathParam("selector") String selector,
								@PathParam("query") String query) {
		ToDoList result = new ToDoList();
		int found = 0;
		
		if (selector.compareTo("description")==0){
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getTask().contains(query)) {
					found++;
				} else {
					result.getToDoList().add(todo);
				}
			}
		} else if (selector.compareTo("context")==0){
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getContext().contains(query)) {
					found++;
				} else {
					result.getToDoList().add(todo);
				}
			}
		} else if (selector.compareTo("project")==0){
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getProject().contains(query)) {
					found++;
				} else {
					result.getToDoList().add(todo);
				}
			}
		}else {
			for (ToDo todo : toDoList.getToDoList()) {
				if (todo.getPriority() == Integer.parseInt(query)) {
					found++;
				} else {
					result.getToDoList().add(todo);
				}
			}
		}
		if (found>0) {
			toDoList.getToDoList().clear();
			toDoList.setToDoList(result.getToDoList());
			return Response.ok(toDoList).build();
		} else{
			return Response.status(Status.NOT_FOUND).build();
		}
	}
	
	/**
	 * A DELETE /todolist/remove/{id}/ request should remove all the ToDO's from
	 * the repository and return an empty ToDo list.
	 * @param selector the ToDo field to search for a match
	 * @param query the text to match
	 * @return 200 if the request is successful
	 */
	@DELETE
	@Path("remove/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeToDo(@PathParam("id") int id) {
		for (int i = 0; i < toDoList.getToDoList().size(); i++) {
			if (toDoList.getToDoList().get(i).getId() == id) {
				toDoList.getToDoList().remove(i);
				return Response.ok(toDoList).build();
			}
		}
		return Response.status(Status.NOT_FOUND).build();
	}
	
	/**
	 * A DELETE /todolist/removeAll/ request should remove all the ToDO's from
	 * the repository and return an empty ToDo list.
	 * @param selector the ToDo field to search for a match
	 * @param query the text to match
	 * @return 200 if the request is successful
	 */
	@DELETE
	@Path("removeAll")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeAll() {
		toDoList.getToDoList().clear();
		return Response.ok(toDoList).build();
	}
}
