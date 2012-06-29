/* 
   Templating from Lightweight UI Components
   @author Charlie Rudenstål 
   @url https://github.com/charlie-rudenstal/LightweightUI-Components-html5-js 
*/

var LC = LC || {};

LC.Templating = (function(me)
{
    // Wraps the template in a div to get its outerHtml. This is important so that
    // template placeholders can be used even in the template tag
    me.render = function(elmTemplate, data, returnHtml)
    {
        var newElement = $(elmTemplate).clone();

        // This code will replace all [tags] with the data provided in the data parameter
        // The string [title] will be replaced by data.title
        // Problem is that a template might contains subtemplates and we shouldn't replace any tags inside
        // because those tags are meant for another set of data. Therefore all elements with an element class
        // will be removed here, before the regexp below does its work, and the reinserted after the regexpes are done
        //var subTemplates = newElement.find(".template");
        var subTemplates = newElement.find("*[data-render]");
        subTemplates.replaceWith("<templatePlaceHolder />");

        // Wrap the element so that we can retrieve its outerHTML and therefore apply the template data
        // and replace tags even on the container
        var wrappedNewElement = $("<div>").append(newElement);
        var outerHtml = wrappedNewElement.html(); 

        for(var i in data) 
        {
            //outerHtml = outerHtml.replace("[" + i + "]", data[i]); // only 1 occurrence
            // For general [tags]
            outerHtml = outerHtml.replace(new RegExp("\\[" + i + "\\]", "g"), data[i]); // all occurrences

            // For conditionl tags [ifBoolean?write this]
            if(data[i]) 
            {
                outerHtml = outerHtml.replace(new RegExp("\\["+ i + "\\?(.+?)\\]", "gi"), "$1");
            }
            else
            {
                // Remove conditional tags if boolean was not satisfied
                outerHtml = outerHtml.replace(new RegExp("\\["+ i + "\\?(.+?)\\]", "gi"), "");
            }
        }

        if(returnHtml) return outerHtml;

        wrappedNewElement.html(outerHtml);
        newElement = $($(wrappedNewElement).children()[0]);
        newElement.attr("id", null);

        // Reinsert subtemplates now that the regexp replacement of [tags] is completed
        newElement.find("templatePlaceHolder").each(function(index, elm)
        {
            //$(elm).replaceWith(subTemplates.get(index));
            // Render these elements (tagged with data-render="[property]" recursively)
            var subTemplate = subTemplates.get(index);
            var dataPropertyToRender = $(subTemplate).attr("data-render");
            $(elm).replaceWith(subTemplate);
            me.fillOrEmptyText(subTemplate, data[dataPropertyToRender]);
        });

        return newElement;
    };

    // Takes an element and replaces it with an identical element with rendered data (using [tags])
    // Or, if the data is an array renders data inside the element using a tag with class="template" as a item template.
    me.fill = function(element, data)
    {
        var $element = $(element);
    
        if($.isArray(data))
        {
            var template = $element.find(".template").get(0);
            $element.children("*:not(.template)").remove();
            for(var i in data)
            {
                if(typeof data[i] == "function") continue;
                var $elm = $(LC.Templating.render(template, data[i]));
                $elm.removeClass("template");
                $element.append($elm);
            }
        }
        else
        {
            var template = $element;
            var $elm = $(LC.Templating.render(template, data));
            $element.replaceWith($elm);
        }   
    }

    me.fillOrEmptyText = function(element, data)
    {   
        element = $(element);

        // Show empty message in element if data is null or data is an empty array
        if(!data || ($.isArray(data) && data.length == 0))
        {   
            element.append($("<li class='emptyText'>").text(element.attr("data-ifempty")));
        }
        else
        {
            me.fill(element, data);
        }
    };

    return me;
})(LC.Templating || {});