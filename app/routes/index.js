import Route from '@ember/routing/route';

export default Route.extend({
    actions: {
        willTransition: function(transition) {
            console.log("RENDERING");
            this.controller.reInitialize();
        }
    }
});