<?php

class Cliente extends Eloquent
{

	public $timestamps = false;
	protected $table = 'AME_Mant_Clientes';
	protected $primaryKey = 'Id_Cliente';
}
