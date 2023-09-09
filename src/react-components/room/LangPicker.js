import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";

export function LangPicker({ onSelect, lang }) {
  const intl = useIntl();

  const handleChange = e => {
    onSelect(e.target.value);
  };

  return (
    <select value={lang} onChange={handleChange}>
      <option value="en">{intl.formatMessage({ id: "langpicker.english", defaultMessage: "English" })}</option>
      <option value="ja">{intl.formatMessage({ id: "langpicker.japanese", defaultMessage: "Japanese" })}</option>
    </select>
  );
}

LangPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired
};
