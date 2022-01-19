import React, { Component } from 'react';
import Styles from './Card.module.scss';
import { Icon } from '@iconify/react';

class Card extends Component {
    handleClick = () => {
        this.props.peticionDelete(this.props.id);
    }

    handleClickEdit = () => {
        this.props.seleccionarProducto(this.props.producto,"Editar");
    }

    handleClickBuy = () => {
        this.props.seleccionarProducto(this.props.producto,"Stock");
    }

    render() {
        return (
            <div className={Styles.Card} style={this.props.index % 3 === 0 ? { backgroundColor: '#FDE2E2' } : this.props.index % 2 === 0 ? { backgroundColor: '#F4EEFF' } : { backgroundColor: '#CAF7E3' }}>
                <h1>{this.props.title}</h1>
                <div className={Styles.category}>
                    {this.props.category}
                </div>
                <h1 className={Styles.price}>${this.props.precio} <span>{this.props.peso}g</span></h1>
                <p>{this.props.stock} Unidades</p>
                <div className={Styles.action} style={this.props.index % 3 === 0 ? { backgroundColor: '#FFCBCB' } : this.props.index % 2 === 0 ? { backgroundColor: '#E6D8FF' } : { backgroundColor: '#95FDCF' }}>
                    <div className={Styles.iconcontainer}>
                        <Icon icon="akar-icons:edit" color="#545454" height="34px" onClick={() => this.handleClickEdit()}/>
                    </div>
                    <Icon icon="fluent:delete-28-regular" color="#545454" height="34px"  onClick={() => this.handleClick()}/>
                    <div className={Styles.iconcontainer} >
                        <Icon icon="clarity:shopping-cart-line" color="#545454" height="34px" onClick={() => this.handleClickBuy()}/>
                    </div>
                </div>
            </div>
            // </div>
        );
    }


}

export default Card;