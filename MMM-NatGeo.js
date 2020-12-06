/* Magic Mirror
 * Module: MMM-NatGeo
 *
 * By Mykle1
 *
 */
Module.register("MMM-NatGeo", {

    // Module config defaults.
    defaults: {
        useHeader: true,             // False if you don't want a header      
        header: "National Geographic",       // Any text you want. useHeader must be true
        maxWidth: "350px",
        animationSpeed: 3000,        // fade speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        rotateInterval: 30 * 1000,   // 30 seconds
        updateInterval: 30 * 60 * 1000,
	apiKey: ""

    },

    getStyles: function() {
        return ["MMM-NatGeo.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

            //  Set locale.
        this.url = "https://newsapi.org/v1/articles?source=national-geographic&sortBy=top&apiKey="+this.config.apiKey;
        this.NatGeo = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "NatGeo Presents . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        } 
		
	var NatGeoKeys = Object.keys(this.NatGeo);
        if (NatGeoKeys.length > 0) {
            if (this.activeItem >= NatGeoKeys.length) {
                this.activeItem = 0;
            }
         var NatGeo = this.NatGeo[NatGeoKeys[this.activeItem]];
 

        var top = document.createElement("div");
        top.classList.add("list-row");

        // The title
        var title = document.createElement("div");
        var NatGeoTitle = document.createElement("p");
        NatGeoTitle.classList.add("small", "bright");
        NatGeoTitle.innerHTML = NatGeo.title; // the first object is NatGeo[0];
        title.appendChild(NatGeoTitle);
        wrapper.appendChild(title);



        // The picture
        var pic = document.createElement("div");
        var img = document.createElement("img");
        img.classList.add("photo");
        img.src = NatGeo.urlToImage; // the first object is NatGeo[0]
        pic.appendChild(img);
        wrapper.appendChild(pic);


        

       // The description
        var description = document.createElement("div");
        var NatGeoDescription = document.createElement("p");
        NatGeoDescription.classList.add("xsmall", "bright", "description");
        NatGeoDescription.innerHTML = NatGeo.description; // the first object is NatGeo[0];
        description.appendChild(NatGeoDescription);
        wrapper.appendChild(description);

		}
        return wrapper;
    },


    processNatGeo: function(data) {
        this.today = data.Today;
        this.NatGeo = data; // NatGeo = objects
		//console.log(this.NatGeo);
        this.loaded = true;
    },

    scheduleCarousel: function() {
        console.log("Carousel of NatGeo fucktion!");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getNatGeo();
        }, this.config.updateInterval);
        this.getNatGeo(this.config.initialLoadDelay);
    },

    getNatGeo: function() {
        this.sendSocketNotification('GET_NATGEO', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NATGEO_RESULT") {
            this.processNatGeo(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
