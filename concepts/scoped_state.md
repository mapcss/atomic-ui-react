# Scoped state

The state and dispatch set have scopes. Typically, a component has a state set
that it uses internally. This is primarily used for event handlers and for
computing attributes.

If you do not need to control the state and dispatch from outside the component,
you do not need to do anything.

If you need to control state and dispatch from outside the component, you can
pass a set of state and dispatch to the component.

This is known as Controllable and Uncontrollable state.

For example, consider a component with a `boolean` state called `isOpen`.

Typically, the `props` of this component will contain two fields,
`initialIsOpen` and `isOpenSet`. (The naming is `initial${State}` and
`${State}Set` for the name of the state.)

The two fields are exclusive and only one of them can be specified. (TypeScript
reports a type error when two fields are specified because of the exclusive
property mechanism.)

If neither field is specified, or if `initialIsOpen` is specified, the `isOpen`
state is uncontrollable. (The `initialIsOpen` allows you to change the state
only when the component is rendered for the first time.)

This state cannot be changed from outside the component. Instead, you will not
have to manage the state.

On the other hand, `isOpenSet` specifies a state set. A state set is a set of
state and their dispatch. It can be the return value of `useState` as is.

When you pass a state set, the component switches its internal state set to it.
This allows you to reference or change state from outside the component.

## Monitor state changes

Typically, a component accepts a callback function to monitor state changes,
whether it is a controllable or uncontrollable state.

In the example above, it accepts a callback function called `onIsOpenChange`.
(The naming convention is `on{$State}Change` for the state name.) This callback
is called whenever `isOpen` is changed.

This is more important for uncontrollable state, which hides state and dispatch
inside the component, so it cannot refer the current state.

The callback can refer to the state because it pass a context containing
`isOpen` as an argument.
