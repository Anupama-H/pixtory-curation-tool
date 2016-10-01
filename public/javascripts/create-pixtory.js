(function(_AppEvent) {
    _AppEvent.subscribe("load.page", function() {
        var croppieObj;

        var autogrowTextarea = function(e) {
            var thisElement = $(this);
            /*  check to see if backspace or delete was pressed, if so, reset the height of the box so it can be resized properly */
            if (e.which == 8 || e.which == 46) {
                thisElement.height(parseFloat(thisElement.css("min-height")) != 0 ? parseFloat(thisElement.css("min-height")) : parseFloat(thisElement.css("font-size")));
            }

            /*  the following will help the text expand as typing takes place */
            while(thisElement.outerHeight() < this.scrollHeight + parseFloat(thisElement.css("borderTopWidth")) + parseFloat(thisElement.css("borderBottomWidth"))) {
                thisElement.height(thisElement.height()+1);
            };
        };

        var validateInputField = function(inputElement) {
            var attr = inputElement.attr("name"),
                value = inputElement.val(),
                isValid = true;

            switch(attr) {
                case "title":
                    if(!value) isValid = false;
                    break;
                case "category1":
                    if(!value || value === "-1") isValid = false;
                    break;
                case "story":
                    if(!value) isValid = false;
                    break;
                case "image":
                    var blobFile = inputElement.get(0).files[0];
                    if(!blobFile) isValid = false;
                    break;
            }

            return isValid;
        };

        var validateFormData = function(inputArray) {
            var isValid = true,
                jqInput;

            inputArray.removeClass("form-error");

            for(var i=0, len=inputArray.length; i<len; i++) {
                jqInput = $(inputArray[i]);
                if(!validateInputField(jqInput)) {
                    isValid = false;
                    jqInput.addClass("form-error");
                }
            }

            return isValid;
        };

        var createPixtory = function(event) {
            event.preventDefault();
            event.stopPropagation();

            var isValid = validateFormData($(".jsCreateForm input, .jsCreateForm textarea, .jsCreateForm select"));

            if(!isValid) {
                Utils.showMessage({
                    type: "error",
                    message: "Please fill all the required fields"
                });
                return;
            }

            Utils.clearMessages();

            croppieObj.croppie("result").then(function(resp) {
                var formElement = $(".jsCreateForm").get(0),
                    blobFile = Utils.dataURItoBlob(resp),
                    formData = new FormData(formElement);

                formData.set("image", blobFile);

                Utils.makeAjaxCall(App.apiEndPoint + "/contributor/createpixtory", "POST", {
                    success: function(response) {
                        Utils.showMessage({
                            type: "success",
                            message: "Uploaded Pixtory Successfully!"
                        });

                        /* clear form fields */
                        formElement.reset();

                        /* trigger a change event on image & select inputs */
                        $(".jsPixtoryImage, select").trigger("change");
                    },
                    error: function(errorMessage) {
                        Utils.showMessage({
                            type: "error",
                            message: errorMessage
                        });
                    }
                }, formData);
			});

        };

        var showHowToCreateModal = function() {
            var data = [{
                    image: "/portal/images/sample-pixtories/pix1.jpg",
                    title: "To the infamous Silk Roads of China",
                    subtitle: "Taklamakan, China",
                    story: "<p>Crossing the Taklamakan, the world's second largest desert, was no easy task for Silk Road travellers. As a result of this trade, numerous small oasis towns sprung up on its edges. Many were run by groups of bandits who stole treasure from the caravans. These treasures, many of them invaluable, such as old manuscripts from China, India and around are still buried under the desert, slowly being excavated!</p><p>The desert also has a highway running right across its belly. With a dozen thin water pipes squirting out water 24/7, reeds and grasses are grown alongside the highway to prevent the shifting sands from enveloping the road. You have to wonder where the water comes from…</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix2.jpg",
                    title: "First meeting lasts a lifetime",
                    story: "<p>Appointment with God<br />Pounding heart and beads of sweat,<br />Tears of joy and sin I forget,<br />Dry lips chanting holy word,<br />For I know, today nothing would do unheard.<br />...<br />That first meeting lasts a lifetime.</p>",
                    center: true
                }, {
                    image: "/portal/images/sample-pixtories/pix3.jpg",
                    title: "Safdarjung Tomb",
                    story: "<p>Let me tell you a funny story.</p><p>Last month after returning from Cambodia I wanted to visit Humayun's Tomb in New Delhi.</p><p>I was hosted by people who live in and around Delhi. As I set foot for the day, the rickshaw wala took us to a historical building saying it's Humayun's Tomb. We saw the Tomb, returned home and realised much later in the day that we had seen Safdarjung Tomb and not Humayun's.</p><p>What irony! People who hosted me and have been living in Delhi forever were confused between the two. I guess we all have that one silly friend anyway. Posing to the idea that this is Humayun's tomb!</p><p>At least it's now a tale to tell and Humayun's Tomb remains unchecked! That's sure next on my list.</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix4.jpg",
                    title: "Delhi Cafe",
                    story: "<p>One fine evening after my duty hours in the hospital, I was strolling through the streets of Delhi. I always stop at a different metro station so that I can explore the area nearby.</p><p>On this day I came across a cafe called Sakleys. As soon as I entered, I was greeted by the lady in the picture. When she smiled, her eyes held the beauty of the universe, enchanting enough to make me come to the cafe everyday onwards. So, did I?</p><p>Is that even a question?</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix5.jpg",
                    title: "The Unspoken",
                    story: "<p>She ran the water for a bath and started to undress but seconds before getting into the water she sat on the edge of the bathtub and that is when she discovered how tired she was. She closed the tap and just sat there, her feet making little waves in the warm water and the water making a clopping noise that was unmusical but always therapeutic somehow. </p><p>She sat there a long time and if he had passed the bathroom door and seen her that way, he wouldn’t have perceived the resignation in the arc of her back, the frustrated hope in her upturned neck, or the thwarted longing in her arms that hung slack and close to her chest. All he would have seen was his wife taking a moment before her bath, a private moment that he naturally shouldn’t impinge on. </p><p>He was considerate that way but he was not perceptive and so, in her perch on the bathtub, he missed all the things her body said that could not be put in words. You could live with someone for years and not know the language of their body.</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix6.jpg",
                    title: "Treasure of Memories",
                    story: "<p>What you see is a normal house.</p><p>What I see is a house full of laughter and memories.</p><p>Most of my childhood was spent in this house. This house was my grandma's, who was the only grandparent we had while growing up. </p><p>It's been 9 years since she left us, but whenever I come here to visit this place, I only think of her and the days we spent with her. The house still remains, but its soul is missing.</p><p></p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix7.jpg",
                    title: "Imarti. That thick'er' cousin of jalebi that nobody wants to be seen with",
                    story: "<p>I didn’t say Imarti is thick. I just said it’s thicker than a regular jalebi. It’s the difference between F-A-T fat and P-H-A-T fat. Like JLo’s butt. Or Alia Bhatt’s brain. The right kind of thick. And still, somehow, nobody wants to be seen with this cousin. It’s Holi. It’s the time for thandai and karanji and gujhiya and malpua and jalebi. Imarti still gets no love. Not even on Holi. That’s rough.</p><p>You know why? You don’t. Because, as always, I have a theory. Of course I do. The reason lies outside the realm of jalebi and imarti. The reason is rabdi. Ever eaten imarti and rabdi? It doesn’t work. Believe me I have tried. It doesn’t work. It just doesn't. Jalebi is Thumbs Up to Imarti’s Pepsi when trying to pair it up with Rabdi’s Old Monk. You see what happened there? Ever order Pepsi and Old Monk at a bar? You will be kicked right out of there in no time. </p><p>Even typing out the words Pepsi and Old Monk in the same sentence is sacrilege. Thumbs Up + Old Monk. That’s Jalebi + Rabdi. Game over imarti. Because no matter how good imarti can taste, jalebi + rabdi is a different level of pleasure altogether. The lesson as always is that world is cruel. You might be right kinds of thick and juicy and the prince will still walk away with someone else. Death and the bridegroom both ride a white horse. Such is life!</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix8.jpg",
                    title: "Names",
                    story: "<p>Over 50,000 gathered around Lake Eola to mourn the victims of the Pulse shooting. As the sun went down, the lake was illuminated by candles. Lining the lake were, flowers, flags, and the names of the victims.</p><p>After the speakers had all spoken and the musicians had all performed, the attendees became silent and the names of the victims were read aloud, one by one. As each name was read, small clusters of people around the lake cheered. They were friends and families of those deceased.</p><p>It was the first time I had ever cried for people I didn’t know.</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix9.jpg",
                    title: "A Club in My Land",
                    story: "<p>For over 12 years now, I’ve followed the English Premier League. The passion is high and the games, the victories, and the losses matter so much to us. The excitement and entertainment is beyond my ability to explain. I’m sure there are millions of football fans like me all over India.</p><p>We’ve always cribbed about Indian football or just simply chose to ignore it. But that has changed for me, and is changing for many these days. Bengaluru Football Club, founded in 2013, got the people in the city together. Initially, it was just a few people, being vocal, singing chants all throughout the game. That passion grew beyond them and has been spreading to reach every football enthusiast in the city.</p><p>West Block Blues, BFC’s most crazy fans always come out in huge numbers to support the club every other week. You can clearly see how much this means to us; it’s a bond that is just growing stronger. We sing, chant, and make creative yet intimidating banners; BFC is now one of the toughest teams to play in the country at their home.</p><p>This season we even had pre-match rituals with flares and chants to get into the mood for the game. 2 championships in 3 years of existence - now that’s an amazing feat.</p><p></p><p>Best club, best fans. If this is in any way an indication, Indian football is on the rise, and fast.</p><p>What remains is - will you be in that number when the blues go marching in?</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix10.jpg",
                    title: "Flamingo",
                    story: '<p>Flamingos migrate to India during the winters and are seen near coastal areas or large water reservoirs. While they are well known for their synchronized dancing routines as mating rituals, did you know that they are pink primarily because of the crustaceans they eat? Shrimp and algae have carotenoids, which have pigments that turn the flamingos pink.</p><p>Perfect example of "You are what you eat" :)</p>'
                }, {
                    image: "/portal/images/sample-pixtories/pix11.jpg",
                    title: "Introspection",
                    subtitle: "Fondation Fernet-Branca, Saint-Louis, France",
                    story: "<p>Here I am, standing in front of this huge work of art. This is how great afternoons should be spent, visiting unpredictable places with friends. This is what I love so much about art museums, you never know what you're going to find inside of them. </p><p>You may see a poster of an exhibition in town and it may catch your attention, but once you're visiting that exhibition, it has nothing to do with what was on the paper. That's why we should always go and see things by ourselves, we shouldn't trust TV, newspaper or ads. </p><p>We never know what we are going to find in museums, and perhaps one day we'll find ourselves in it.</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix12.jpg",
                    title: "Silfra",
                    subtitle: "Silfra, Iceland",
                    story: "<p>We know what's on top of continents, but do you know what lies beneath?</p><p>When two tectonic plates drift apart, a rift is formed in between. Silfra, located right between the Eurasian and North American tectonic plates, grows 2cm larger every year, creating fissures from which pure Langjökull glacier water emerges.</p><p>Neither black nor white, up nor down, left nor right. For 40 minutes, I explored the beauty of the between.</p>"
                }, {
                    image: "/portal/images/sample-pixtories/pix13.jpg",
                    title: "Firsts",
                    story: "<p>There is always that one person<br />you have known since<br />before that rude<br />awakening that dimmed<br />your shine.<br /><br />Reality, adults called it. <br />But you would much rather<br />go back to sleep,<br />in your dreams you have<br />never felt the need to dissect<br />your feelings<br />into their causes and catalysts.<br /><br />Isn't it a cruel game of<br />arbitrary occurrence who we meet<br />before world fucks us up and over,<br /><br />Imagine, a dice roll with a<br />thousand sides where eight <br />hundred and ninety two<br />of them will take you<br />to people who do<br />not have a one track mind<br />like you, but you have <br />already had their names<br />tattooed in your arteries just<br />moments before you woke up,<br />and now, there are no more firsts to fail at.</p>",
                    center: true
                }, {
                    image: "/portal/images/sample-pixtories/pix14.jpg",
                    title: "Normal reactions to abnormal things",
                    story: "<p>Dear Milenka, </p><p>I realized something strange about myself today and thought I must share this with you. You see, it is only with you that I can share the sound of a tree falling in the forest of my soul. Do you know that saying? If a tree falls in a forest and no one hears it, did it still fall?</p><p> Such a terrible fate for the tree, isn’t it? Anyway, here is what I realized: Most people have normal reactions to normal things, and abnormal reactions to abnormal things. My good friend Max can calmly solve a knotty problem involving his tax returns. If, however, I tell him there is no god and we are all here alone, he will get agitated and mutter, “Don’t say that, Ivan.” But then you have me. I have abnormal reactions to normal things, and normal reactions to abnormal things. </p><p>The pending tax return will keep me up at night. I am too terrified to approach it. It seems to conceal a terrible truth about me. It is also full of inscrutable monsters who will laugh as I try to decode them. But show me unarguable proof that there is no god or tell me that the bride doesn’t want to get married and is lying in a field outside the church or break the news to me that I have a terminal illness and only six months to live – and the truth my dear Milenka is that I will bear all this news calmly, and the abnormality of these things will sustain my soul as though it has finally found something it can chew on. </p><p>Freud might say I am a melancholic and hence, unconsciously seeking destruction. Jung might say I can see the shadows of the collective unconscious. I don’t wish to even remotely suggest that I am something special, Milenka. I have no illusions about myself. But I notice this thing about me and it seems anomalous when compared to the rest of the people I meet, and I would like very much for you to tell me what you think. </p><p>I have also made the arrogant presumption, forgive me my dear - that you, with your vibrant mind and your softly penetrating eyes are also somewhat like me; chronically averse to the normal, but easily flowing into the abnormal, like a cat that avoids all the big beds in the house and instead crawls into a small, misshapen cardboard box and sleeps a beautiful sleep there for many hours. </p><p>Ivan</p>"
                }
            ];

            Utils.showModal({
                template: "contrib-how-pixtory",
                data: data
            });
        };

        var setupPixtoryImageCropper = function() {
            var croppieElem = $(".jsCroppie");

            var onImageUploaded = function() {
                var uploadStage1 = $(".jsUpload1"),
                    uploadStage2 = $(".jsUpload2");

                var blobFile = this.files[0];
                if(blobFile) {
                    var reader = new FileReader();
                    reader.onload = function(e) {

                        croppieObj.croppie("bind", {
                            url: e.target.result
                        });

                        if(uploadStage1.is(":visible")) {
                            uploadStage1.hide();
                            uploadStage2.show();
                        }
                    }

                    reader.readAsDataURL(blobFile);
                } else {
                    uploadStage2.hide();
                    uploadStage1.show();
                }
            };

            croppieObj = croppieElem.croppie({
                boundary: {
                    width: 300,
                    height: 526
                },
                viewport: {
                    width: 300,
                    height: 526,
                    type: "square"
                },
                customClass: "custom-croppie",
                showZoomer: false
            });

            $(".jsPixtoryImage").on("change", onImageUploaded);
        };

        var setupFormEventHandlers = function() {
            /* Create Pixtory event handler */
            $(".jsCreatePixtory").on("click", createPixtory);

            /* Autogrow text area event handler */
            $("textarea").keyup(autogrowTextarea);

            /* Enable/disable select input event handler */
            $("select").on("change", function() {
                var $this = $(this),
                    selectValue = this.value,
                    currentSelectBox = $this.attr("name"),
                    otherSelectBox = (currentSelectBox === "category1") ? "category2" : "category1";

                if(selectValue !== "-1") {
                    $this.addClass("select-enable");
                } else {
                    $this.removeClass("select-enable");
                }

                /* disable current selected value in the other select box */
                $("option").removeAttr("disabled");
                $("[name='" + otherSelectBox + "'] option[value='" + selectValue + "']").attr("disabled", "disabled");
            });

            $(".jsHowToCreate").on("click", showHowToCreateModal);
        };

        setupFormEventHandlers();
        setupPixtoryImageCropper();
    });
})(AppEvent);
