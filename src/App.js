import { Icon } from '@iconify/react';
import { Box, Modal, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import swal from 'sweetalert';
import './App.scss';
import Card from './components/Card/Card';
import search from './images/search.svg'

function App() {

  const [productos, setProductos] = useState([]);
  const [tablaProductos, setTablaProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [venta, setVenta] = useState('');
  const [productoSelect, setProductoSelect] = useState({
    id: '',
    nombre: '',
    categoria: '',
    referencia: '',
    precio: 0,
    peso: 0,
    stock: '',
  })

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openEditar, setOpenEditar] = useState(false);
  const handleOpenEditar = () => setOpenEditar(true);
  const handleCloseEditar = () => setOpenEditar(false);
  const [openVenta, setOpenVenta] = useState(false);
  const handleOpenVenta = () => setOpenVenta(true);
  const handleCloseVenta = () => setOpenVenta(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setProductoSelect((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleChangeBusqueda = e => {
    setBusqueda(e.target.value)
    filtrar(e.target.value)
  }

  const handleChangeVenta = e => {
    setVenta(e.target.value)
  }

  const filtrar = (texto) => {
    let resultados = tablaProductos.filter((producto) => {
      if (producto.nombre.toString().toLowerCase().includes(texto.toLowerCase())
      ) {
        return producto
      }
    });
    setProductos(resultados)
  }

  const peticion = async () => {
    await axios.get('http://localhost:80/APIKonecta')
      .then((res) => {
        setProductos(res.data)
        setTablaProductos(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const peticionPost = async () => {
    var f = new FormData();
    var date = new Date()
    f.append("nombre", productoSelect.nombre)
    f.append("referencia", productoSelect.referencia)
    f.append("precio", productoSelect.precio)
    f.append("peso", productoSelect.peso)
    f.append("categoria", productoSelect.categoria)
    f.append("stock", productoSelect.stock)
    f.append("fecha_de_creacion", date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate())
    f.append("METHOD", "POST")
    await axios.post('http://localhost:80/APIKonecta/', f)
      .then(res => {
        setProductos(productos.concat(res.data))
        handleClose()
      })
      .catch(error => {
        console.log(error)
      })
  }

  const peticionPut = async () => {
    var f = new FormData();
    f.append("nombre", productoSelect.nombre)
    f.append("referencia", productoSelect.referencia)
    f.append("precio", productoSelect.precio)
    f.append("peso", productoSelect.peso)
    f.append("categoria", productoSelect.categoria)
    f.append("stock", productoSelect.stock)
    f.append("METHOD", "PUT");
    console.log("\n y el stock es " + productoSelect.stock)

    await axios.post('http://localhost:80/APIKonecta/', f, { params: { id: productoSelect.id_producto } })
      .then(response => {
        var productosNuevos = productos;
        productosNuevos.map(producto => {
          if (producto.id_producto === productoSelect.id_producto) {
            producto.nombre = productoSelect.nombre;
            producto.referencia = productoSelect.referencia;
            producto.precio = productoSelect.precio;
            producto.peso = productoSelect.peso;
            producto.categoria = productoSelect.categoria;
            producto.stock = productoSelect.stock;
          }
        });
        setProductos(productosNuevos);
        handleCloseEditar()
      }).catch(error => {
        console.log(error);
      })
  }

  const peticionPutVenta = async () => {
    let stocknew
    if ((productoSelect.stock - venta) < 0) {

    } else {
      stocknew = productoSelect.stock - venta
      var f = new FormData();
      f.append("nombre", productoSelect.nombre)
      f.append("referencia", productoSelect.referencia)
      f.append("precio", productoSelect.precio)
      f.append("peso", productoSelect.peso)
      f.append("categoria", productoSelect.categoria)
      f.append("stock", stocknew)
      f.append("METHOD", "PUT");
      await axios.post('http://localhost:80/APIKonecta/', f, { params: { id: productoSelect.id_producto } })
        .then(response => {
          var productosNuevos = productos;
          productosNuevos.map(producto => {
            if (producto.id_producto === productoSelect.id_producto) {
              console.log("entra")
              producto.nombre = productoSelect.nombre;
              producto.referencia = productoSelect.referencia;
              producto.precio = productoSelect.precio;
              producto.peso = productoSelect.peso;
              producto.categoria = productoSelect.categoria;
              producto.stock = stocknew;
            }
          });
          setProductos(productosNuevos);
          peticionventa()
          handleClose()
        }).catch(error => {
          console.log(error);
        })
    }

  }

  const peticionDelete = async (id_producto) => {
    var f = new FormData();
    f.append("METHOD", "DELETE")
    swal({
      title: "¿Estas Seguro?",
      text: "Una vez eliminado, no podras recuperar la información de este producto",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          axios.post('http://localhost:80/APIKonecta/', f, { params: { id: id_producto } })
            .then(res => {
              setProductos(productos.filter(producto => producto.id_producto !== id_producto))
              handleClose()
            })
            .catch(error => {
              console.log(error)
            })
        } else {

        }
      });
  }

  const peticionventa = async () => {
    var f = new FormData();
    f.append("id_producto", productoSelect.id_producto)
    f.append("cantidad", venta)
    f.append("METHOD", "POST")
    await axios.post('http://localhost:80/APIKonecta/ventas/', f)
      .then(res => {
        console.log(res)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const seleccionarProducto = (producto, caso) => {
    setProductoSelect(producto);

    (caso === "Editar") ?
      handleOpenEditar() : handleOpenVenta()
  }

  useEffect(() => {
    peticion();
  }, [])

  return (
    <div className='App'>
      <img className='logo' src="https://www.grupokonecta.com/wp-content/uploads/2016/11/logo-konecta-azul-1.svg" alt="" />
      <div className="bar">
        <div className="buscador">
          <img src={search} alt="" />
          <input
            type="search"
            placeholder="Buscar"
            name="filterastro"
            value={busqueda}
            onChange={handleChangeBusqueda}
          />
        </div>
        <div className='agregar' onClick={handleOpen}>
          <div className="iconcontainer">
            <Icon icon="ant-design:plus-outlined" color="#545454" height="34px" />
          </div>
          <span>Agregar</span>
        </div>
      </div>
      <div className="CardDeck">
        {productos && productos.map((producto, i) => (
          <>
            <Card index={i} key={i} producto={producto} title={producto.nombre} category={producto.categoria} precio={producto.precio} peso={producto.peso} stock={producto.stock} referencia={producto.referencia} id={producto.id_producto} peticionDelete={peticionDelete} seleccionarProducto={seleccionarProducto} setProductoSelect={setProductoSelect} peticionPutVenta={peticionPutVenta} />
          </>
        ))}

      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='o_modal'>
          <Box className='o_form'
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            autoComplete="off">
            <h1>Agrega un nuevo producto</h1>
            <TextField required fullWidth id="outlined-basic" label="Nombre" variant="outlined" name="nombre" onChange={handleChange} />
            <TextField required fullWidth id="outlined-basic" label="Categoria" variant="outlined" name="categoria" onChange={handleChange} />
            <TextField required fullWidth id="outlined-basic" label="Referencia" variant="outlined" name="referencia" onChange={handleChange} />
            <TextField required fullWidth id="outlined-basic" label="Precio" variant="outlined" name="precio" onChange={handleChange} />
            <TextField required fullWidth id="outlined-basic" label="Peso" variant="outlined" name="peso" onChange={handleChange} />
            <TextField required fullWidth id="outlined-basic" label="Stock" variant="outlined" name="stock" onChange={handleChange} />
            <button onClick={() => peticionPost()}>Insertar</button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openEditar}
        onClose={handleCloseEditar}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='o_modal'>
          <Box className='o_form'
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            onSubmit={() => peticionPut()}
            autoComplete="off">
            <h1>Edita el producto</h1>
            <TextField required fullWidth id="outlined-basic" label="Nombre" variant="outlined" name="nombre" onChange={handleChange} value={productoSelect && productoSelect.nombre} />
            <TextField required fullWidth id="outlined-basic" label="Categoria" variant="outlined" name="categoria" onChange={handleChange} value={productoSelect && productoSelect.categoria} />
            <TextField required fullWidth id="outlined-basic" label="Referencia" variant="outlined" name="referencia" onChange={handleChange} value={productoSelect && productoSelect.referencia} />
            <TextField required fullWidth id="outlined-basic" label="Precio" variant="outlined" name="precio" onChange={handleChange} value={productoSelect && productoSelect.precio} />
            <TextField required fullWidth id="outlined-basic" label="Peso" variant="outlined" name="peso" onChange={handleChange} value={productoSelect && productoSelect.peso} />
            <TextField required fullWidth id="outlined-basic" label="Stock" variant="outlined" name="stock" onChange={handleChange} value={productoSelect && productoSelect.stock} />
            <button type='submit' >Editar</button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openVenta}
        onClose={handleCloseVenta}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className='o_modal'>
          <Box className='o_form'
            component="form"
            sx={{
              '& > :not(style)': { m: 1 },
            }}
            onSubmit={() => peticionPutVenta()}
            autoComplete="off">
            <h1>Venta de Producto</h1>
            <TextField required fullWidth type="number" InputProps={{ inputProps: { min: 0, max: productoSelect.stock } }}  id="outlined-basic" label="Cantidad" variant="outlined" name="cantidad" onChange={handleChangeVenta} value={venta} />
            <button type='submit' >Realizar Venta</button>
          </Box>
        </Box>
      </Modal>

    </div>
  );
}

export default App;
