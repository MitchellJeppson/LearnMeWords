
function sendPostRequest(path, data){

    const method = "post";

    const form = document.createElement('form');

    form.setAttribute("method", "post");
    form.setAttribute("action", path);

    for(const key of Object.entries(data)){
        const field = document.createElement('input');
        field.setAttribute('type', 'hidden');
        field.setAttribute('name', key[0]);
        field.setAttribute('value', key[1]);

        form.appendChild(field);
    }

    document.body.appendChild(form);
    form.submit();
}
