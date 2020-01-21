export async function gen_datos(meta) {
    /* div generico de ajustes */
    let div = document.createElement("div");

    let grid = document.createElement("div");
    grid.setAttribute("class", "mdl-grid");
    meta = meta.dataset;

    await carta(grid, "Dataset_id", meta.dataset_id);
    await carta(grid, "Dataset_uid", meta.dataset_uid);
    await carta(grid, "Dataset_uid", meta.attachments.toString());
    await carta(grid, "has_records", meta.has_records);
    await carta(grid, "data_visible", meta.data_visible);
    await carta(grid, "features", meta.features.toString());

    meta = meta.metas.default;

    await carta(grid, "records_count", meta.records_count);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let fecha = new Date(meta.modified);
    await carta(grid, "modified", fecha.toLocaleString("es-ES", options));
    await carta(grid, "source_domain_address", meta.source_domain_address);
    await carta(grid, "keyword", meta.keyword);
    await carta(grid, "source_domain_title", meta.source_domain_title);
    await carta(grid, "geographic_reference", meta.geographic_reference);
    await carta(grid, "timezone", meta.timezone);
    await carta(grid, "title", meta.title);
    await carta(grid, "parent_domain", meta.parent_domain);
    await carta(grid, "theme", meta.theme);
    await carta(grid, "modified_updates_on_data_change", meta.modified_updates_on_data_change);
    fecha = new Date(meta.metadata_processed);
    await carta(grid, "metadata_processed", fecha.toLocaleString("es-ES", options));
    fecha = new Date(meta.data_processed);
    await carta(grid, "data_processed", fecha.toLocaleString("es-ES", options));
    await carta(grid, "territory", meta.territory);
    await carta(grid, "description", meta.description);
    await carta(grid, "modified_updates_on_metadata_change", meta.modified_updates_on_metadata_change);
    await carta(grid, "shared_catalog", meta.shared_catalog);
    await carta(grid, "source_domain", meta.source_domain);
    await carta(grid, "attributions", meta.attributions);
    await carta(grid, "geographic_area_mode", meta.geographic_area_mode);
    await carta(grid, "geographic_reference_auto", meta.geographic_reference_auto);
    await carta(grid, "geographic_area", meta.geographic_area);
    await carta(grid, "publisher", meta.publisher);
    await carta(grid, "language", meta.language);
    await carta(grid, "source_dataset", meta.source_dataset);
    await carta(grid, "metadata_languages", meta.metadata_languages);
    await carta(grid, "oauth_scope", meta.oauth_scope);
    await carta(grid, "federated", meta.federated);
    await carta(grid, "license_url", meta.license_url);


    div.appendChild(grid);
    return div;
}

export async function carta(grid, titulo, dato){
    if(dato === "undefined" || dato === "null" || dato === undefined || dato === null || dato === ""){
        return;
    }
    let div = document.createElement("div");
    div.setAttribute("class", "mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--4-col-phone carta");
    let titulo_carta = document.createElement("div");
    titulo_carta.setAttribute("class", "titulo_carta");
    titulo_carta.innerText = titulo;
    div.appendChild(titulo_carta);
    let dato_carta = document.createElement("div");
    dato_carta.setAttribute("class", "dato_carta");
    dato_carta.innerHTML = dato;
    div.appendChild(dato_carta);

    grid.appendChild(div);
}