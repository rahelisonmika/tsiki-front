'use client';

import { useCart } from '@/store/cart/cart';
import { Button } from '@mui/material';
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import {AddToCartButtonProps} from './AddToCartButton.type';


export default function AddToCartButton({ product,
                                          typeButton = 'basic'
                                        }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);

  if(typeButton === 'basic'){
    return (

      <Button
          size="small"
          variant="outlined"
          startIcon={<AddShoppingCartOutlinedIcon />}
          disabled={!product.inStock}
          title={product.inStock ? "Ajouter au panier" : "Indisponible"}
          onClick={() => addItem(product)}
          sx={{
              borderRadius: 2,
              //display: { xs: "none", sm: "inline-flex" },
              bgcolor: "brandButtonPrimary.main",
              color: "brandButtonPrimary.light",
              "&:hover": { bgcolor: "brandButtonPrimary.dark" },
              "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
          }}
      >
      Ajouter
      </Button>
    );
  }else{
    return(
      <Button variant="contained" size="large" onClick={() => addItem(product)} disabled={!product.inStock}>
        Ajouter au panier
      </Button>
    );
  }

  
}