import { Component, OnInit, Input } from '@angular/core';
import { AbiItem } from 'web3-utils';

@Component({
  selector: 'app-abi-interaction',
  templateUrl: './abi-interaction.component.html',
  styleUrls: ['./abi-interaction.component.sass']
})
export class AbiInteractionComponent implements OnInit {
  @Input() abi!: AbiItem[];

  constructor() { }

  ngOnInit(): void {}

}
