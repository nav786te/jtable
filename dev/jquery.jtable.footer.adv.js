/************************************************************************
* FOOTER extension for jTable                                           *
* Author: Muhammad Anwar - nav786te
* Rev. 2.0
*************************************************************************/
(function($)
  {

    //Reference to base object members
    var base = {
    _create: $.hik.jtable.prototype._create,
    _addRowToTable: $.hik.jtable.prototype._addRowToTable,
    _removeRowsFromTable: $.hik.jtable.prototype._removeRowsFromTable,
    _onRecordsLoaded: $.hik.jtable.prototype._onRecordsLoaded,
    _onRecordUpdated: $.hik.jtable.prototype._onRecordUpdated, // added
    };

    //extension members
    $.extend(true, $.hik.jtable.prototype,
      {

        /************************************************************************
    * DEFAULT OPTIONS / EVENTS                                              *
     *************************************************************************/
      options: {
        footer: false
        },

        /************************************************************************
    * PRIVATE FIELDS                                                        *
    *************************************************************************/

      _$tfoot: null, //Reference to the footer area in bottom panel

        /************************************************************************
    * OVERRIDED METHODS                                                     *
    *************************************************************************/

        /* Overrides base method to create footer constructions.
     *************************************************************************/
      _create: function() {
          base._create.apply(this, arguments);
          if(this.options.footer) {
            //this._createTableFoot(); // moved to _onRecordsLoaded // moved
          }
        },

        /* Overrides _addRowToTable method to re-load table when a new row is created.
    *************************************************************************/
      _addRowToTable: function($tableRow, index, isNewRow) {
          if (isNewRow && this.options.footer) {
            this._reloadTable();
            return;
          }

          base._addRowToTable.apply(this, arguments);
        },

        /* Overrides _removeRowsFromTable method to re-load table when a row is removed from table.
    *************************************************************************/
      _removeRowsFromTable: function($rows, reason) {
          base._removeRowsFromTable.apply(this, arguments);

          if (this.options.footer) {
            this._reloadTable();
          }
        },

        /* Overrides _onRecordsLoaded method to to render footer row.
    *************************************************************************/
      _onRecordsLoaded: function(data) {
          var self = this;

          if(this.options.footer && this._$tableRows.length > 0) {// check if no data - changed
            this._createTableFoot(); // moved here from _create - moved
            this._$tfoot.find('th').each(function (index, cell)
              {
                var $cell = $(cell);
                var fieldName = $cell.data('fieldName');
                if(fieldName != undefined) {//added
                  if(self.options.fields[fieldName].footer)
                  {
                    $cell.find('span')
                    .empty()
                    .append(self.options.fields[fieldName].footer(data));
                  }
                }
              }
            );
          }

          base._onRecordsLoaded.apply(this, arguments);
          if(this.options.footer && this._$tableRows.length > 0) { //added
            this._$tfoot.show();
          }
        },
        /* Overrides _onRecordsLoaded method to to render footer row. // added
    *************************************************************************/
      _onRowUpdated: function($row) {

          if (this.options.footer) {
            this._reloadTable();
          }
        },

        /************************************************************************
    * PRIVATE METHODS                                                       *
    *************************************************************************/

        /* Creates footer (all column footers) of the table.
    *************************************************************************/
      _createTableFoot: function () {
          this._$tfoot = $('<tfoot></tfoot>').appendTo(this._$table).hide(); // hide footer until records not loaded - changed
          this._addRowToTableFoot(this._$tfoot);
        },

        /* Adds tr element to given tfoot element
    *************************************************************************/
      _addRowToTableFoot: function ($tfoot) {
          var $tr = $('<tr></tr>').appendTo($tfoot);
          this._addColumnsToFooterRow($tr);
        },

        /* Adds column footer cells to given tr element.
    *************************************************************************/
      _addColumnsToFooterRow: function ($tr) {

          /////////////////////////////////////
          // bug fix does not skip empty header columns,
          // e.g. when commmand columns added at first column position
          // or when checkbox column added by "SELECTING" extension
          for (var i = 0; i < this._firstDataColumnOffset; i++) { // added
            this._createFooterCellForField('', '').appendTo($tr);
          }
          ////////////////////////////////////

          for (var i = 0; i < this._columnList.length; i++) {
            var fieldName = this._columnList[i];
            var $footerCell = this._createFooterCellForField(fieldName, this.options.fields[fieldName]);
            $footerCell.data('fieldName', fieldName).appendTo($tr);
          }
        },

        /* Creates a header cell for given field.
    *  Returns th jQuery object.
    *************************************************************************/
      _createFooterCellForField: function (fieldName, field) {
          return $('<th class="jtable-column-footer">' +
            '<div class="jtable-column-footer-container"><span class="jtable-column-footer-text"></span></div></th>');
        }
      }
    );

  }
)(jQuery);
