let array_root = [];
const app = document.getElementById('app');
const btn_delete = document.getElementById('delete');
const btn_update = document.getElementById('update');
const confirmation = document.getElementById('exampleModal');
const timer = document.getElementById('timer');
/**
 * timerId & count for timer 20 second
 */
let timerId;
let count;

/**
 * Create class for ajax request
 */
class HttpRequest {
    xmlHttp = this.get_xmlHttp();

    constructor(url, data = null) {
        this.url = url
        this.data = data;
    }

    get_xmlHttp() {
        return new XMLHttpRequest();
    }

    /**
     * ajax query for GET all records in table Tree
     * @returns {string}
     */
    httpGet() {
        this.xmlHttp.open("GET", this.url, false);
        this.xmlHttp.send(null);
        return this.xmlHttp.responseText;
    }

    /**
     * ajax query for POST create/update record in table Tree
     * @returns {string}
     */
    httpPost() {
        let json = JSON.stringify({
            name: this.data.name,
            parent_id: this.data.parent_id,
            id: this.data.id
        });
        this.xmlHttp.open("POST", this.url, false);
        this.xmlHttp.setRequestHeader('Content-type', 'application/json');
        this.xmlHttp.send(json);
        return this.xmlHttp.responseText;
    }

    /**
     * ajax query for DELETE delete record in table Tree
     * @returns {string}
     */
    httpDelete() {
        this.xmlHttp.open("DELETE", this.url + '?id=' + this.data.id, false);
        this.xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        this.xmlHttp.send();
        return this.xmlHttp.responseText;
    }
}

class Root {
    constructor(id, name,parent_id) {
        this.id = id;
        this.name = name;
        this.parent_id = parent_id;
    }
}

function add_root(parent_id = 0) {
    const name = get_name_new_root();
    // check has Root
    if (parent_id === 0 && array_root.length > 0) {
        let root = array_root.find(e => e.parent_id == null);
        alert('Root has already,  name: ' + root.name);
        return
    }
    let root = new Root(null, name, parent_id)
    // store on server new Root method POST
    let response = storeRoot(root)
    root.id = response.id
    createRoot(root)
}

/**
 * Store new element to table
 *  * @param root
 * @returns {any}
 */
function storeRoot(root) {
    return JSON.parse(new HttpRequest(
        window.location.protocol + "//" + window.location.host + '/database.php', root)
        .httpPost());
}

/**
 * create array of Tree
 * @param root
 */
function createRoot(root) {
    array_root.push(root);
    buildingHtml_fromArray(root);
}

/**
 * Input name element of Tree
 * @returns {string}
 */
function get_name_new_root() {
    let name;
    while (!name) {
        name = prompt('Enter name Root')
    }
    return name;
}

/**
 * Crate HTML from array of root
 * @param root
 */
function buildingHtml_fromArray(root) {
    let insert_root = null;
    let new_root = document.createElement('li');
    /**
     * create button add for root
     * @type {HTMLButtonElement}
     */
    let button_add = document.createElement('button');
    button_add.innerHTML = '+';
    button_add.setAttribute('id', root.id);
    button_add.onclick = function () {
        add_root(this.id)
    };
    button_add.classList.add('h-8', 'w-8', 'ml-2', 'mr-1', 'bg-green');
    //
    /**
     * create button remove for root
     * @type {HTMLButtonElement}
     */
    let button_remove = document.createElement('button');
    button_remove.innerHTML = '-';
    button_remove.setAttribute('id', root.id);
    button_remove.onclick = function () {
        modal_delete(this.id);
    };
    button_remove.classList.add('h-8', 'w-8', 'bg-red');

    /**
     * created ul.nested for future elements
     * @type {HTMLUListElement}
     */
    let ul_nested = document.createElement('ul');
    ul_nested.classList.add('nested');
    //create new root
    new_root.setAttribute('id', root.id);
    new_root.innerHTML = `<span class='root'></span><span class="edit">${root.name}</span>`;

    new_root.appendChild(button_add);
    new_root.appendChild(button_remove);
    if (Number(root.parent_id) !== 0) {
        insert_root = document.getElementById(root.parent_id);
        insert_root.querySelector('span.root').classList.add('caret');
        if (!insert_root.querySelector('ul.nested'))
            insert_root.appendChild(ul_nested);
        insert_root = insert_root.querySelector('ul.nested');
    } else {
        insert_root = app
    }
    insert_root.appendChild(new_root);
    toggle_caret()
}

/**
 * Building  lines from the root to the element & event when press caret
 */
function toggle_caret() {

    let caret = document.getElementsByClassName("caret");

    draw_lines();

    /**
     * Create SVG element
     * @param height
     * @param width
     * @returns {SVGSVGElement}
     */
    function create_svg(height, width) {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.classList.add('line')
        svg.setAttributeNS(null, "width", width);
        svg.setAttributeNS(null, "height", height);
        svg.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
        svg.classList.add('svg')
        return svg
    }

    /**
     * Create Line element
     * @param x1
     * @param x2
     * @param y1
     * @param y2
     * @returns {SVGLineElement}
     */
    function create_line(x1, x2, y1, y2) {
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('stroke', 'black')
        line.setAttribute('stroke-dasharray', '4')
        line.setAttribute('x1', x1)
        line.setAttribute('y1', y1)
        line.setAttribute('x2', x2)
        line.setAttribute('y2', y2)
        return line;
    }

    /**
     * draw lines
     */
    function draw_lines() {
        let app = document.getElementById('app');
        let svg;
        let line;
        document.querySelectorAll('svg').forEach(e => e.remove());
        /**
         * draw horizontal line
         */

        for (let i = app.querySelectorAll('li').length - 1; i > 0; i--) {
            let li = (app.querySelectorAll('li')[i]);
            if (li.offsetParent !== null) {
                let e = li.parentElement;
                svg = e.appendChild(create_svg(1, li.offsetLeft - e.offsetLeft + 40));
                line = svg.appendChild(create_line(0, li.offsetLeft - e.offsetLeft + 40, 0, 0));
                svg.style.top = li.offsetTop + 15;
                svg.style.left = e.offsetLeft - 40;
            }
        }

        let ul = document.querySelectorAll('ul');

        /**
         * draw vertical line
         * @param ul
         * @param left
         * @param top
         * @param height
         */
        function draw_vertical(ul, left, top, height) {

            svg = ul.appendChild(create_svg(height, 1));
            line = svg.appendChild(create_line(0, 0, 0, height));
            svg.style.top = top - 10;
            svg.style.left = left - 40;
        }

        /**
         * calculation elements for draw vertical line
         */
        ul.forEach(ul => {
            if (ul.offsetLeft !== 0) {
                if (ul.classList.contains('nested')) {
                    let offsetTop = 0;
                    ul.childNodes.forEach(el => {
                        if (el.nodeName === 'LI') {
                            offsetTop = el.offsetTop
                        }
                    });
                    draw_vertical(ul, ul.offsetLeft, ul.offsetTop, offsetTop - ul.offsetTop + 27)
                }
            }
        })
    }

    /**
     * if has caret
     */
    if (caret.length > 0) {
        for (let item of caret) {

            if (item.parentElement.querySelector(".nested").children.length === 0) {
                item.classList.remove("caret-down", 'caret');
                item.parentElement.querySelector(".nested").remove()

            }
            /**
             * create listen on click caret for translate caret & redraw line
             */
            item.onclick = function () {

                if (this.parentElement.querySelector(".nested")) {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caret-down");
                }
                draw_lines(this);
            }
        }
    }
    /**
     * create listen on click name element for change name
     */
    document.querySelectorAll('span.edit').forEach(el => {
        el.onclick = function () {
            modal_update(el.parentElement.getAttribute('id'))
        }
    })
}

/**
 * Show modal window if press button delete
 * @param id
 */
function modal_delete(id) {
    document.getElementById('exampleModalLabel').innerHTML = "<span> Delete confirmation </span>";
    document.querySelector('.modal-body').innerHTML = "<span>This is very dangerous, you shouldn't do it! Are you really sure?</span>";
    document.getElementById('timer').classList.remove('d-none');
    document.querySelector('.modal-footer').classList.add('justify-content-between');
    btn_delete.classList.remove('d-none');
    btn_update.classList.add('d-none');
    btn_delete.attributes['data-id'].value = id;
    count = 20;
    timer.innerText = count;
    timerId = null;
    timerId = setInterval(() => decrease_timer(count), 1000);
    $(confirmation).modal('show');
}

/**
 * show modal window if press Name element
 * @param id
 */
function modal_update(id) {
    let root = findRootById(id);
    document.getElementById('exampleModalLabel').innerHTML = "<span> Rename element: " + root.name + " </span>";
    document.querySelector('.modal-footer').classList.remove('justify-content-between');
    document.querySelector('.modal-body').innerHTML = `
        <label for="exampleInputEmail1">Rename element</label>
    <input type="text" class="form-control" id="updateName">
`;
    document.getElementById('updateName').value = root.name;
    btn_delete.classList.add('d-none');
    btn_update.classList.remove('d-none');
    btn_update.attributes['data-id'].value = id;
    document.getElementById('timer').classList.add('d-none');
    $(confirmation).modal('show');
}

/**
 * store new name if press button confirmation
 */
function update() {
    let id;
    let new_name = document.getElementById('updateName').value
    if (btn_update.hasAttributes()) {
        id = btn_update.attributes['data-id'].value
    }
    let index = array_root.findIndex(e => e.id == id)
    array_root[index].name = new_name
    let root = findRootById(id);

    let response = storeRoot(root)
    if (response.result !== 'success') {
        alert('Change not save')
    }
    document.getElementById(id).querySelector('span.edit').textContent = new_name;
    /**
     * hide modal window
     */
    hide();
    /**
     * redraw
     */
    toggle_caret()

}

/**
 * get root by id
 * @param id
 * @returns {root}
 */
function findRootById(id) {
    return array_root.find(e => Number(e.id) === Number(id))
}

/**
 * stop timer & hide modal window
 */
function hide() {
    clearInterval(timerId);
    timerId = '';
    $(confirmation).modal('hide')
}

function remove() {
    function callback_delete(e) {
        return e.parent_id == id || e.id == id;
    }

    function callback_filtered(e) {
        return e.parent_id != id && e.id != id;
    }

    let id;
    /**
     * get id button delete pressed
     */
    if (btn_delete.hasAttributes()) {
        id = btn_delete.attributes['data-id'].value
    }

    if (id == null) return array_root = [];

    let array_delete = array_root.filter(callback_delete);// only deleted items
    array_root = array_root.filter(callback_filtered); // Tree without deleted items
    let ids_delete = array_delete.map(e => e.id);
    /**
     * Delete on server from table all elements where parent_id==id
     */
    ids_delete.forEach(function (id) {
        (JSON.parse(new HttpRequest(window.location.protocol + "//" + window.location.host + '/database.php', {'id': id}).httpDelete()));
    });
    let delete_element = document.getElementById(id)
    let children = delete_element.parentElement.parentElement.children
    children[0].classList.remove('caret', 'caret-down')
    delete_element.remove();
    /**
     * delete ul down deleted elements with id
     */
    children[4].remove()
    /**
     * hide modal window
     */
    hide();
    /**
     * redraw
     */
    toggle_caret()

}

/**
 *
 * @returns Integer||call hide()
 */
decrease_timer = () => {
    count--;
    timer.innerText = count;
    if (count <= 0) {
        {
            hide();
        }
    }
    return count
};

/**
 *  if modal window press Esc or click out modal
 */
$(confirmation).on('hidden.bs.modal', function (event) {
    hide()
});
/**
 * load Tree from server & building html structure
 * */
let tree = JSON.parse(new HttpRequest(window.location.protocol + "//" + window.location.host + '/database.php').httpGet());
tree.map(e => {
    createRoot((e))
})