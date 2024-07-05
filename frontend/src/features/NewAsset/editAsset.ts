/*const handleUpdateAsset = async (updatedAsset: newAssetModels) => {
    if (selectedNewAsset) {
      try {
        const newAssetId = selectedNewAsset.id;
        const formData = new FormData();
        formData.append("CodigoCuenta", selectedNewAsset.CodigoCuenta.toString());
        formData.append("Zona", selectedNewAsset.Zona.toString());
    formData.append("Tipo", selectedNewAsset.Tipo.toString());
    formData.append("Estado", selectedNewAsset.Estado.toString());
    formData.append("Descripcion", selectedNewAsset.Descripcion);
    formData.append("NumeroPlaca", selectedNewAsset.NumeroPlaca.toString());
    formData.append("ValorCompraCRC", selectedNewAsset.ValorCompraCRC);
    formData.append("ValorCompraUSD", selectedNewAsset.ValorCompraUSD);
    if (newAsset.Fotografia) {
      formData.append("Fotografia", newAsset.Fotografia);
    }
    formData.append("NombreProveedor", selectedNewAsset.NombreProveedor);
    formData.append("FechaCompra", selectedNewAsset.FechaCompra.toString());
    formData.append("FacturaNum", selectedNewAsset.FacturaNum.toString());
    if (newAsset.FacturaImagen) {
      formData.append("FacturaImagen", newAsset.FacturaImagen);
    }
    formData.append("OrdenCompraNum", selectedNewAsset.OrdenCompraNum.toString());
    if (newAsset.OrdenCompraImagen) {
      formData.append("OrdenCompraImagen", newAsset.OrdenCompraImagen);
    }
    formData.append("NumeroAsiento", selectedNewAsset.NumeroAsiento.toString());
    formData.append("NumeroBoleta", selectedNewAsset.NumeroBoleta);
    formData.append("Usuario", user?.nombre_usuario || ""); 
        
        await api.newAsset.updateNewAsset(newAssetId, formData);
        toast.success("Activo Ingresado Actualizado");
        setOpenEditDialog(false);
        loadNewAsset();
      } catch (error) {
        console.error("Error al actualizar El Activo Ingresado:", error);
      }
    }
  };*/

  