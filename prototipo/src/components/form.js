export function buildForm(schema, initial = {}) {
  const form = document.createElement('form');
  form.className = 'form';
  form.noValidate = true;
  const refs = {};

  schema.forEach(f => {
    const wrap = document.createElement('div');
    wrap.className = 'field';
    const id = `f_${f.name}`;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = f.label;
    wrap.appendChild(label);

    let input;
    if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = f.rows || 3;
    } else if (f.type === 'select') {
      input = document.createElement('select');
      (f.options || []).forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.value; opt.textContent = o.label;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement('input');
      input.type = f.type || 'text';
      if (f.min != null) input.min = f.min;
      if (f.max != null) input.max = f.max;
      if (f.step != null) input.step = f.step;
      if (f.placeholder) input.placeholder = f.placeholder;
    }
    input.id = id;
    input.name = f.name;
    if (initial[f.name] != null) input.value = initial[f.name];

    const err = document.createElement('div');
    err.className = 'err';

    wrap.appendChild(input);
    wrap.appendChild(err);
    form.appendChild(wrap);
    refs[f.name] = { input, err, schema: f };
  });

  function getValues() {
    const out = {};
    Object.entries(refs).forEach(([k, r]) => { out[k] = r.input.value; });
    return out;
  }

  function validate() {
    let ok = true;
    Object.entries(refs).forEach(([k, r]) => {
      r.err.textContent = '';
      const v = r.input.value;
      const fn = r.schema.validate;
      const errMsg = fn ? fn(v) : null;
      if (errMsg) { r.err.textContent = errMsg; ok = false; }
    });
    return ok;
  }

  return { el: form, getValues, validate, refs };
}
