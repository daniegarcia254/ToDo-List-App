package rest.todows;

import org.eclipse.persistence.jaxb.rs.MOXyJsonProvider;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.server.ResourceConfig;

public class ApplicationConfig extends ResourceConfig {

	/**
     * Default constructor
     */
    public ApplicationConfig() {
    	this(new ToDoList());
    }


    /**
     * Main constructor
     * @param toDoList a provided ToDo list
     */
    public ApplicationConfig(final ToDoList toDoList) {
    	register(CrossDomainFilter.class);
    	register(ToDoWebService.class);
    	register(MOXyJsonProvider.class);
    	register(new AbstractBinder() {

			@Override
			protected void configure() {
				bind(toDoList).to(ToDoList.class);
			}});
	}	
}
