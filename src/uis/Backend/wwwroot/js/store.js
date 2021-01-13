﻿window.onload = function () {
    "use strict";

    const auth = JSON.parse(window.localStorage.getItem("auth"));

    if (auth == null) {
        window.location = "/index.html";
    }

    common.get(settings.uri + "identity/validate?email=" + encodeURIComponent(auth.email) + "&token=" + encodeURIComponent(auth.token), function (userId) {
        userId = JSON.parse(userId);

        let modal;
        function loadCatalog() {
            common.get(settings.uri + "catalog", function (catalogItems) {
                catalogItems = JSON.parse(catalogItems);

                let items = [];
                for (let i = 0; i < catalogItems.length; i++) {
                    const catalogItem = catalogItems[i];
                    items.push("<tr>"
                        + "<td class='id'>" + catalogItem.id + "</td>"
                        + "<td class='name'>" + catalogItem.name + "</td>"
                        + "<td class='desc'>" + catalogItem.description + "</td>"
                        + "<td class='price'>" + catalogItem.price + "</td>"
                        + "<td><input type='button' value='Güncelle' class='update btn btn-success' /><input type='button' value='Sil' class='remove btn btn-danger' /></td>"
                        + "</tr>");
                }
                let table = "<table class='table'>"
                    + "<thead class='thead-dark'>"
                    + "<tr>"
                    + "<th>Ürün Adı</th>"
                    + "<th>Açıklama</th>"
                    + "<th>Fiyat</th>"
                    + "<th></th>"
                    + "</tr>"
                    + "</thead>"
                    + "<tbody>"
                    + items.join("")
                    + "</tbody>"
                    + "</table>";
                document.querySelector(".catalog").innerHTML = table;

                const rows = document.querySelector(".catalog").getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const updateButton = row.querySelector(".update");
                    updateButton.onclick = function () {
                        const catalogItemId = row.querySelector(".id").innerHTML;
                        const catalogItemName = row.querySelector(".name").innerHTML;
                        const catalogItemDesc = row.querySelector(".desc").innerHTML;
                        const catalogItemPrice = parseFloat(row.querySelector(".price").innerHTML);

                        if (modal) {
                            modal.destroy();
                        }

                        modal = new jBox("Modal", {
                            width: 800,
                            height: 420,
                            title: catalogItemName,
                            content: document.getElementById("item").innerHTML,
                            footer: document.getElementById("item-footer").innerHTML,
                            overlay: true,
                            delayOpen: 0,
                            onOpen: function () {
                                let jBoxContent = document.getElementsByClassName("jBox-content")[0];
                                jBoxContent.querySelector(".name").value = catalogItemName;
                                jBoxContent.querySelector(".desc").value = catalogItemDesc;
                                jBoxContent.querySelector(".price").value = catalogItemPrice;
                                let jBoxFooter = document.getElementsByClassName("jBox-footer")[0];
                                const saveButton = jBoxFooter.querySelector(".save");
                                saveButton.onclick = function () {
                                    const name = jBoxContent.querySelector(".name").value;
                                    const desc = jBoxContent.querySelector(".desc").value;
                                    const price = parseFloat(jBoxContent.querySelector(".price").value);

                                    if (name !== "" && desc !== "") {
                                        const catalogItem = {
                                            "id": catalogItemId,
                                            "name": name,
                                            "description": desc,
                                            "price": price
                                        };

                                        common.put(settings.uri + "catalog", function () {
                                            modal.destroy();
                                            loadCatalog();
                                        }, function () {
                                            alert("Error while updating catalog item.");
                                        }, catalogItem, auth.token);
                                    } else {
                                        alert("Error: Empty values.");
                                    }
                                };
                            }
                        });

                        modal.open();
                    };
                    const removeButton = row.querySelector(".remove");
                    removeButton.onclick = function () {
                        const res = confirm("Silmek  istediğine emin misin?");
                        if (res === true) {
                            const catalogItemId = row.querySelector(".id").innerHTML;

                            common.delete(settings.uri + "catalog/" + encodeURIComponent(catalogItemId), function () {
                                row.remove();
                            }, function () {
                                alert("Error while removing item.");
                            }, auth.token);
                        }
                    };
                }

            }, function () {
                alert("Error while retrieving catalog.");
            }, auth.token);
        }

        loadCatalog();

        document.getElementById("add").onclick = function () {
            if (modal) {
                modal.destroy();
            }

            modal = new jBox("Modal", {
                width: 800,
                height: 420,
                title: "Yeni ürün ekle",
                content: document.getElementById("item").innerHTML,
                footer: document.getElementById("item-footer").innerHTML,
                overlay: true,
                delayOpen: 0,
                onOpen: function () {
                    let jBoxContent = document.getElementsByClassName("jBox-content")[0];
                    let jBoxFooter = document.getElementsByClassName("jBox-footer")[0];
                    const saveButton = jBoxFooter.querySelector(".save");
                    saveButton.onclick = function () {
                        const name = jBoxContent.querySelector(".name").value;
                        const desc = jBoxContent.querySelector(".desc").value;
                        const price = parseFloat(jBoxContent.querySelector(".price").value);

                        if (name !== "" && desc !== "") {
                            const catalogItem = {
                                "name": name,
                                "description": desc,
                                "price": price
                            };

                            common.post(settings.uri + "catalog", function () {
                                modal.destroy();
                                loadCatalog();
                            }, function () {
                                alert("Error while creating catalog item.");
                            }, catalogItem, auth.token);
                        } else {
                            alert("Error: Empty values.");
                        }
                    };
                }
            });

            modal.open();
        };

        document.getElementById("logout").onclick = function () {
            window.localStorage.removeItem("auth");
            window.location = "/index.html";
        };
    }, function () {
        window.location = "/index.html";
    });

};
